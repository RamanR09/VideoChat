import React, { useRef, useEffect } from "react";

const VideoPlayer = ({ stream }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      className="w-full h-full bg-black"
    />
  );
};

export default VideoPlayer;
