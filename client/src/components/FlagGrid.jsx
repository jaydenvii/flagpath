import React, { useState, useEffect } from "react";

const FlagGrid = ({
  flagImageMap,
  gameProgress,
  gridCountries,
  currCountry,
  lives,
  correctClickedFlags,
  incorrectClickedFlags,
  flagClick,
  isNeighbor,
}) => {
  return (
    <div>
      <div className="flex justify-center">
        {/* <div className="w-[900px] h-[600px]"> */}
        <div className="md:w-[750px] md:h-[500px] lg:w-[900px] lg:h-[600px]">
          <div className="grid grid-cols-6 grid-rows-6 w-full h-full">
            {gridCountries.map((rowArray, rowIndex) =>
              rowArray.map((id, colIndex) => {
                // Adjacent flags
                const isAdjacent = isNeighbor(rowIndex, colIndex);

                return (
                  // Border around the flag
                  <div
                    key={id}
                    className={`relative border hover:border-[2px] sm:hover:border-[3px] border-gray-200 hover:border-yellow-300 cursor-pointer ${
                      id === currCountry
                        ? "border-[2px] sm:border-[4px] border-amber-400"
                        : ""
                    }`}
                    onClick={() => flagClick(rowIndex, colIndex)}
                  >
                    {/* Image of the flag */}
                    <div className="w-full h-full">
                      <img
                        src={flagImageMap[id]}
                        alt=""
                        className={`w-full h-full object-cover ${
                          (currCountry && !isAdjacent && id !== currCountry) || // Dims all countries that are not adjacent
                          (isAdjacent && gameProgress !== "running") || // Dims adjacent countries if the game is over
                          gameProgress === "lost"
                            ? "opacity-40"
                            : ""
                        }`}
                      />
                    </div>
                    {/* Green correct overlay */}
                    {correctClickedFlags.includes(id) && (
                      <div className="absolute top-0 left-0 w-full h-full bg-opacity-75 bg-green-500"></div>
                    )}
                    {/* Red incorrect overlay */}
                    {incorrectClickedFlags.includes(id) && (
                      <div className="absolute top-0 left-0 w-full h-full bg-opacity-75 bg-red-500"></div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
      <p className="mt-4 sm:text-4xl xs:text-3xl text-2xl text-center">
        Lives left: {lives}
      </p>
    </div>
  );
};

export default FlagGrid;
