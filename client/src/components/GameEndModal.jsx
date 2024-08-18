import React from "react";
import ShareButton from "./ShareButton";

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
        <h2 className="text-3xl font-bold mb-4 text-center">
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
        {/* Correct path */}
        <p className="text-xl mb-2">Correct Path:</p>
        <div className="flex justify-center flex-wrap gap-2">
          {countryOrder.map((countryId, index) => {
            // Determine if it's the first or last country
            const isFirstCountry = index === 0;
            const isLastCountry = index === countryOrder.length - 1;

            return (
              <div
                key={countryId}
                className={`flex flex-col justify-between p-2 w-[150px] rounded text-center ${
                  isFirstCountry
                    ? "bg-blue-500"
                    : isLastCountry
                    ? "bg-red-500"
                    : "bg-gray-700"
                }`}
              >
                <p className="flex-grow">
                  {index + 1}. {getCountryName(countryId)}
                </p>
                <img
                  src={flagImageMap[countryId]}
                  alt={getCountryName(countryId)}
                  className="border"
                />
              </div>
            );
          })}
        </div>
        {/* Mistakes */}
        <p className="text-xl mb-2">Mistakes:</p>
        <div className="flex justify-center flex-wrap gap-2">
          {mistakes.map((countryId, index) => {
            return (
              <div
                key={countryId}
                className="flex flex-col justify-between p-2 w-[150px] rounded text-center bg-gray-700"
              >
                <p className="flex-grow">
                  {index + 1}. {getCountryName(countryId)}
                </p>
                <img
                  src={flagImageMap[countryId]}
                  alt={getCountryName(countryId)}
                  className="border"
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default GameEndModal;
