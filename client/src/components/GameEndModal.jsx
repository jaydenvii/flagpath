import React from "react";
import ShareButton from "./ShareButton";
import CountryList from "./CountryList";

const GameEndModal = ({
  isOpen,
  onClose,
  gridId,
  gameState,
  finishedLives,
  countryOrder,
  mistakes,
  getCountryName,
  flagImageMap,
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
        <h2 className="text-4xl font-bold mb-4 text-center">
          🎌FlagPath #{gridId}
        </h2>
        <p className="text-4xl text-center">
          {checkMarks}
          {crosses}
        </p>
        <p className="text-xl text-center">
          {gameState === "won"
            ? `You won with ${finishedLives}/3 lives!`
            : "You lost all of your lives."}
        </p>
        {/* Share button */}
        <ShareButton
          gridId={gridId}
          finishedLives={finishedLives}
          checkMarks={checkMarks}
          crosses={crosses}
        />
        {/* Correct Path */}
        <CountryList
          title="Correct Path"
          countries={countryOrder}
          flagImageMap={flagImageMap}
          getCountryName={getCountryName}
          highlightFirstAndLast={false}
        />
        {/* Mistakes */}
        <CountryList
          title="Mistakes"
          countries={mistakes}
          flagImageMap={flagImageMap}
          getCountryName={getCountryName}
          highlightFirstAndLast={false}
        />
      </div>
    </div>
  );
};

export default GameEndModal;
