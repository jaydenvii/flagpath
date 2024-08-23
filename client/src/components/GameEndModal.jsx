import React from "react";
import ShareButton from "./ShareButton";
import CorrectPathFlags from "./CorrectPathFlags";
import MistakeFlags from "./MistakeFlags";

const GameEndModal = ({
  isOpen,
  onClose,
  gridId,
  gameProgress,
  lives,
  countryOrder,
  preFirstGuessMistakes,
  postFirstGuessMistakes,
  getCountryName,
  flagImageMap,
}) => {
  if (!isOpen) return null;

  // Lives left
  const maxLives = 3;
  const checkMarks = "✅".repeat(lives);
  const crosses = "❌".repeat(maxLives - lives);

  return (
    <div className="bg-gray-800 fixed inset-0 bg-opacity-70 flex items-center justify-center overflow-auto">
      <div className="w-[768px] bg-gray-900 p-8 rounded-lg shadow-lg relative border-2 border-gray-200 max-h-full overflow-y-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-0 right-2 hover:text-gray-200 text-4xl"
        >
          &times;
        </button>
        {/* Modal Content */}
        <h2 className="text-4xl font-bold mb-4 text-center">
          🎌FlagPath #{gridId}
        </h2>
        <p className="text-4xl text-center">
          {checkMarks}
          {crosses}
        </p>
        <p className="text-xl text-center">
          {gameProgress === "won"
            ? `You won with ${lives}/3 lives!`
            : "You lost all of your lives."}
        </p>
        {/* Share button */}
        <ShareButton
          gridId={gridId}
          lives={lives}
          checkMarks={checkMarks}
          crosses={crosses}
        />
        {/* Correct Path */}
        <CorrectPathFlags
          countries={countryOrder}
          flagImageMap={flagImageMap}
          getCountryName={getCountryName}
        />
        {/* Mistakes (only shows when there are mistakes) */}
        {preFirstGuessMistakes.length > 0 ||
        postFirstGuessMistakes.length > 0 ? (
          <MistakeFlags
            preFirstGuessMistakes={preFirstGuessMistakes}
            postFirstGuessMistakes={postFirstGuessMistakes}
            flagImageMap={flagImageMap}
            getCountryName={getCountryName}
          />
        ) : null}
      </div>
    </div>
  );
};

export default GameEndModal;
