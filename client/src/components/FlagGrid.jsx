import React, { useState, useEffect, useMemo } from "react";

const FlagGrid = ({
  allCountries,
  firstCountry,
  lastCountry,
  gridCountries,
  onGameEnd,
}) => {
  const [firstCountryClicked, setFirstCountryClicked] = useState(false);
  const [currCountry, setCurrCountry] = useState("");
  const [gameState, setGameState] = useState("running");
  const [clickedFlagColors, setClickedFlagColors] = useState({});
  const [lives, setLives] = useState(3);

  // Imports all flag images (vite)
  const flagImages = import.meta.glob("../assets/flags/*.png", {
    eager: true,
  });

  // Creates a map to access the flag images
  const flagImageMap = useMemo(() => {
    return Object.keys(flagImages).reduce((map, path) => {
      const id = path.match(/\/([^/]+)\.png$/)[1];
      map[id] = flagImages[path].default;
      return map;
    }, {});
  }, []);

  // Monitors for when the player hits 0 lives
  useEffect(() => {
    if (lives === 0) {
      setGameState("lost");
    }
  }, [lives]);

  // Monitors for when the player won/lost
  useEffect(() => {
    if (gameState === "won" || gameState === "lost") {
      onGameEnd(gameState, lives);
    }
  }, [gameState]);

  // Handles game progression by clicking on flags
  const flagClick = (row, col) => {
    const id = gridCountries[row][col];

    // Check for valid click
    if (
      clickedFlagColors[id] || // If the flag has already been clicked
      (firstCountryClicked && !isNeighbor(row, col)) || // If the flag is not a neighbor
      gameState === "won" || // If the game is already won
      gameState === "lost" // If the game is already lost
    ) {
      return;
    }

    // First correct country
    if (!firstCountryClicked && id === firstCountry) {
      setFirstCountryClicked(true);
      setCurrCountry(firstCountry);
      changeFlagColor(id, "green");
    }
    // Subsequent correct countries
    else if (
      firstCountryClicked &&
      allCountries[currCountry].borders.includes(id)
    ) {
      setCurrCountry(id);
      changeFlagColor(id, "green");

      // Checks if the game is won
      if (id === lastCountry) {
        setGameState("won");
      }
    }
    // Incorrect country
    else {
      setLives((prev) => prev - 1);

      changeFlagColor(id, "red");
    }
  };

  // Checks if the clicked flag is adjacent to the current flag on the grid
  const isNeighbor = (row, col) => {
    const currPosition = findPosition(currCountry);
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
        if (gridCountries[row][col] === countryId) {
          return [row, col];
        }
      }
    }
    return null;
  };

  // Changes the flags' colours to show a correct/incorrect guess
  const changeFlagColor = (id, color) => {
    setClickedFlagColors((prev) => ({
      ...prev,
      [id]: color,
    }));
  };

  return (
    <div>
      <div className="flex justify-center">
        <div className="w-[900px] h-[600px]">
          <div className="grid grid-cols-6 grid-rows-6 w-full h-full">
            {gridCountries.map((rowArray, rowIndex) =>
              rowArray.map((id, colIndex) => (
                <div
                  key={id}
                  className="relative border hover:border-[3px] border-gray-200 hover:border-yellow-300 cursor-pointer"
                  onClick={() => flagClick(rowIndex, colIndex)}
                >
                  {/* Image of the flag */}
                  <div className="w-full h-full">
                    <img
                      src={flagImageMap[id]}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* Green/red overlay */}
                  {(clickedFlagColors[id] === "green" ||
                    clickedFlagColors[id] === "red") && (
                    <div
                      className={`absolute top-0 left-0 w-full h-full bg-opacity-75 ${
                        clickedFlagColors[id] === "green"
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                    ></div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      <p className="mt-4 text-4xl text-center">Lives left: {lives}</p>
    </div>
  );
};

export default FlagGrid;
