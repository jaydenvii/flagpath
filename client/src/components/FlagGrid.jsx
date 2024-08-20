import React, { useState, useEffect } from "react";

const FlagGrid = ({
  flagImageMap,
  gridCountries,
  countryOrder,
  firstCountry,
  lastCountry,
  onGameEnd,
}) => {
  const [gameState, setGameState] = useState("running");
  const [currCountry, setCurrCountry] = useState("");
  const [currCountryIndex, setCurrCountryIndex] = useState(-1);
  const [firstCountryClicked, setFirstCountryClicked] = useState(false);
  const [correctClickedFlags, setCorrectClickedFlags] = useState([]);
  const [mistakes, setMistakes] = useState([]);
  const [lives, setLives] = useState(3);

  // Updates currCountry when currCountryIndex changes
  useEffect(() => {
    setCurrCountry(countryOrder[currCountryIndex]);
  }, [currCountryIndex]);

  // Monitors for when the player hits 0 lives
  useEffect(() => {
    if (lives === 0) {
      setGameState("lost");
    }
  }, [lives]);

  // Monitors for when the player won/lost
  useEffect(() => {
    if (gameState === "won" || gameState === "lost") {
      onGameEnd(gameState, lives, mistakes);
    }
  }, [gameState]);

  // Handles game progression by clicking on flags
  const flagClick = (row, col) => {
    const id = gridCountries[row][col];

    // Check for valid click
    if (
      correctClickedFlags.includes(id) || // If the flag has already been clicked
      (firstCountryClicked && !isNeighbor(row, col)) || // If the flag is not a neighbor
      gameState === "won" || // If the game is already won
      gameState === "lost" // If the game is already lost
    ) {
      return;
    }

    // First correct country
    if (!firstCountryClicked && id === firstCountry) {
      setFirstCountryClicked(true);
      setCurrCountryIndex(0);
      displayFlagAsCorrect(id);
    }
    // Subsequent correct countries
    else if (firstCountryClicked && id === countryOrder[currCountryIndex + 1]) {
      setCurrCountryIndex((prev) => prev + 1);
      displayFlagAsCorrect(id);

      // Checks if the game is won
      if (id === lastCountry) {
        setGameState("won");
      }
    }
    // Incorrect country
    else {
      setLives((prev) => prev - 1);
      setMistakes((prev) => [...prev, id]);
    }
  };

  // Checks if the clicked flag is adjacent to the current flag on the grid
  const isNeighbor = (row, col) => {
    const currPosition = findPosition(currCountryIndex);
    if (!currPosition) return false;

    const [currRow, currCol] = currPosition;

    const neighbors = [
      [currRow - 1, currCol], // Above
      [currRow + 1, currCol], // Below
      [currRow, currCol - 1], // Left
      [currRow, currCol + 1], // Right
    ];

    return neighbors.some(([r, c]) => r === row && c === col);
  };

  // Finds the position of a country in the grid
  const findPosition = (countryId) => {
    for (let row = 0; row < gridCountries.length; row++) {
      for (let col = 0; col < gridCountries[row].length; col++) {
        if (gridCountries[row][col] === countryOrder[countryId]) {
          return [row, col];
        }
      }
    }
    return null;
  };

  // Adds a green tint to a flag to show a correct guess
  const displayFlagAsCorrect = (id) => {
    setCorrectClickedFlags((prev) => [...prev, id]);
  };

  return (
    <div>
      <div className="flex justify-center">
        <div className="w-[900px] h-[600px]">
          <div className="grid grid-cols-6 grid-rows-6 w-full h-full">
            {gridCountries.map((rowArray, rowIndex) =>
              rowArray.map((id, colIndex) => {
                // Adjacent flags
                const isAdjacent = isNeighbor(rowIndex, colIndex);

                return (
                  // Border around the flag
                  <div
                    key={id}
                    className={`relative border hover:border-[3px] border-gray-200 hover:border-yellow-300 cursor-pointer ${
                      id === currCountry ? "border-[4px] border-amber-400" : ""
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
                          (isAdjacent && gameState != "running") // Dims adjacent countries if the game is over
                            ? "opacity-40"
                            : ""
                        }`}
                      />
                    </div>
                    {/* Green overlay */}
                    {correctClickedFlags.includes(id) && (
                      <div className="absolute top-0 left-0 w-full h-full bg-opacity-75 bg-green-500"></div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
      <p className="mt-4 text-4xl text-center">Lives left: {lives}</p>
    </div>
  );
};

export default FlagGrid;
