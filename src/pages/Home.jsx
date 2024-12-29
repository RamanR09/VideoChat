import React from "react";
import { useNavigate } from "react-router-dom";
import { databases } from "../utils/appwrite";
import Navbar from "../components/Navbar";

const Home = () => {
  const navigate = useNavigate();

  const createRoom = async () => {
    try {
      const roomId = Math.random().toString(36).substring(2, 10);
      const id = roomId;

      // Replace 'video_chat_db_id' and 'rooms_collection_id' with actual IDs from Appwrite
      await databases.createDocument(
        "67702efd00007eb461b0",
        "67702f14000563b4dcf8",
        roomId,

        { id, createdAt: Date.now() }
      );

      console.log("Room created:", roomId);
      navigate(`/call/${roomId}`);
    } catch (error) {
      console.error("Error creating room:", error.message);
      alert("Failed to create room. Please try again.");
    }
  };
  return (
    <div className="text-center p-4">
      <Navbar />
      <h2 className="text-2xl my-4">Create a New Room</h2>
      <button
        onClick={createRoom}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Generate Room Code
      </button>
    </div>
  );
};

export default Home;
