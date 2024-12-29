import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import VideoPlayer from "../components/VideoPlayer";

const socket = io("http://localhost:3001");

const Call = () => {
  const { roomId } = useParams();
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const peerConnection = useRef(null);
  const makingOffer = useRef(false);

  useEffect(() => {
    peerConnection.current = new RTCPeerConnection();

    // Get local media stream
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setLocalStream(stream);
        stream
          .getTracks()
          .forEach((track) => peerConnection.current.addTrack(track, stream));
      })
      .catch((error) => {
        console.error("Error accessing media devices:", error);
      });

    // Handle negotiation needed
    peerConnection.current.onnegotiationneeded = async () => {
      try {
        if (makingOffer.current) return; // Avoid overlapping offers
        makingOffer.current = true;

        const offer = await peerConnection.current.createOffer();
        await peerConnection.current.setLocalDescription(offer);

        socket.emit("offer", peerConnection.current.localDescription, roomId);
      } catch (error) {
        console.error("Error during negotiation:", error);
      } finally {
        makingOffer.current = false;
      }
    };

    // Handle track event
    peerConnection.current.ontrack = (event) => {
      setRemoteStream(event.streams[0]);
    };

    // Handle ICE candidates
    peerConnection.current.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice-candidate", event.candidate, roomId);
      }
    };

    // Listen for offers from other peers
    socket.on("offer", async (offer) => {
      try {
        const readyForOffer =
          peerConnection.current.signalingState === "stable" ||
          peerConnection.current.signalingState === "have-local-offer";

        if (!readyForOffer) {
          console.warn("Rolling back signaling state to handle new offer.");
          await peerConnection.current.setLocalDescription({
            type: "rollback",
          });
        }

        await peerConnection.current.setRemoteDescription(
          new RTCSessionDescription(offer)
        );
        const answer = await peerConnection.current.createAnswer();
        await peerConnection.current.setLocalDescription(answer);

        socket.emit("answer", peerConnection.current.localDescription, roomId);
      } catch (error) {
        console.error("Error handling offer:", error);
      }
    });

    // Listen for answers from other peers
    socket.on("answer", async (answer) => {
      try {
        await peerConnection.current.setRemoteDescription(
          new RTCSessionDescription(answer)
        );
      } catch (error) {
        console.error("Error handling answer:", error);
      }
    });

    // Listen for ICE candidates
    socket.on("ice-candidate", (candidate) => {
      peerConnection.current
        .addIceCandidate(new RTCIceCandidate(candidate))
        .catch((error) => {
          console.error("Error adding received ICE candidate:", error);
        });
    });

    // Join the room
    socket.emit("join-room", roomId);

    // Cleanup on unmount
    return () => {
      if (peerConnection.current) {
        peerConnection.current.close();
      }
      socket.off("offer");
      socket.off("answer");
      socket.off("ice-candidate");
    };
  }, [roomId]);

  return (
    <div className="flex">
      <div className="w-1/2">
        <VideoPlayer stream={localStream} />
      </div>
      <div className="w-1/2">
        <VideoPlayer stream={remoteStream} />
      </div>
    </div>
  );
};

export default Call;
