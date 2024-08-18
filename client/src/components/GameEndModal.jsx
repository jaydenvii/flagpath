import React from "react";
import ShareButton from "./ShareButton";

const GameEndModal = ({
  isOpen,
  onClose,
  gridId,
  gameState,
  finishedLives,
}) => {
  if (!isOpen) return null;

  // Lives left
  const maxLives = 3;
  const checkMarks = "✅".repeat(finishedLives);
  const crosses = "❌".repeat(maxLives - finishedLives);

  return (
    <div className="bg-gray-800 fixed inset-0 bg-opacity-70 flex items-center justify-center">
      <div className="w-[40vw] bg-gray-900 p-8 rounded-lg shadow-lg relative border-2 border-gray-200">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-0 right-2 hover:text-gray-200 text-4xl"
        >
          &times;
        </button>
        {/* Modal Content */}
        <h2 className="text-3xl font-bold mb-4 text-center">
          🎌FlagPath #{gridId}
        </h2>
        <p className="text-4xl text-center">
          {checkMarks}
          {crosses}
        </p>
        <p className="text-xl text-center">
          {gameState === "won"
            ? `You won with ${finishedLives}/3 Lives!`
            : "You lost all of your lives."}
        </p>

        <ShareButton
          gridId={gridId}
          finishedLives={finishedLives}
          checkMarks={checkMarks}
          crosses={crosses}
        />
      </div>
    </div>
  );
};

export default GameEndModal;
