import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { databases } from "../utils/appwrite";
import Navbar from "../components/Navbar";

const Join = () => {
  const [roomId, setRoomId] = useState("");
  const navigate = useNavigate();

  const joinRoom = async () => {
    try {
      // Replace 'video_chat_db_id' and 'rooms_collection_id' with actual IDs from Appwrite
      const response = await databases.getDocument(
        "67702efd00007eb461b0",
        "67702f14000563b4dcf8",
        roomId
      );

      if (response) {
        console.log("Room exists:", response);
        navigate(`/call/${roomId}`);
      }
    } catch (error) {
      console.error("Room not found:", error.message);
      alert("Invalid room code. Please try again.");
    }
  };

  return (
    <div className="text-center p-4">
      <Navbar />
      <h2 className="text-2xl my-4">Join a Room</h2>
      <input
        type="text"
        placeholder="Enter Room Code"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
        className="border p-2 w-1/2"
      />
      <button
        onClick={joinRoom}
        className="px-4 py-2 bg-green-500 text-white rounded ml-2"
      >
        Join
      </button>
    </div>
  );
};

export default Join;
