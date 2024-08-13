import React from "react";

const GameEndModal = ({ isOpen, onClose, gameState, finishedLives }) => {
  if (!isOpen) return null;

  return (
    <div className="bg-gray-800 fixed inset-0 bg-opacity-70 flex items-center justify-center">
      <div className="bg-gray-900 p-8 rounded-lg shadow-lg relative border-2 border-gray-200">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-0 right-2 hover:text-gray-200 text-4xl"
        >
          &times;
        </button>
        {/* Modal Content */}
        <h2 className="text-2xl font-bold mb-4">Game Summary</h2>
        <p>
          {gameState === "won"
            ? `You won with ${finishedLives} lives remaining!`
            : "You lost."}
        </p>
      </div>
    </div>
  );
};

export default GameEndModal;
