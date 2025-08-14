import React from "react";
import { useNavigate } from "react-router-dom";

const PublishPopup = ({ onClose }) => {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
      <div className="relative bg-gray-800 text-white rounded-2xl p-8 w-80 text-center shadow-xl">
        {/* Cross icon */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-200 text-xl font-bold"
        >
          &times;
        </button>

        <h2 className="text-2xl font-bold mb-4">Announcement Published!</h2>
        <p className="mb-6">Your notice has been successfully published.</p>

        <div className="flex justify-around gap-4">
          <button
            className="bg-yellow-400 text-black px-4 py-2 rounded hover:bg-yellow-300"
            onClick={() => navigate("/")}
          >
            View
          </button>
          <button
            className="bg-yellow-400 text-black px-4 py-2 rounded hover:bg-yellow-300"
            onClick={() => navigate("/publish")}
          >
            Publish More
          </button>
        </div>
      </div>
    </div>
  );
};

export default PublishPopup;
