import React, { useState, useEffect } from "react";
import countryData from "../countries.json";

const FlagGrid = () => {
  const firstCountry = "PRT";
  const lastCountry = "BLR";

  const [firstCountryClicked, setFirstCountryClicked] = useState(false);
  const [currCountry, setCurrCountry] = useState("");
  const [gameFinished, setGameFinished] = useState(false);
  const [clickedFlagColors, setClickedFlagColors] = useState({});
  const [allCountries, setAllCountries] = useState({});
  const [loading, setLoading] = useState(true);

  const gridCountries = [
    ["AFG", "AGO", "ALB", "PRT", "ARE", "BGR"],
    ["ARG", "FRA", "AND", "ESP", "ARM", "BHR"],
    ["CAN", "BEL", "ATG", "AUS", "BHS", "AUT"],
    ["AZE", "NLD", "DEU", "CZE", "SVK", "BIH"],
    ["BDI", "BEN", "BFA", "BGD", "UKR", "MNG"],
    ["COL", "CUB", "CRI", "CPV", "BLR", "MOZ"],
  ];

  // Load all countries' data
  useEffect(() => {
    setAllCountries(countryData);
  }, []);

  // Handles game progression by clicking on flags
  const flagClick = (row, col) => {
    const id = gridCountries[row][col];

    // Check for valid click
    if (
      clickedFlagColors[id] || // If the flag has already been clicked
      (firstCountryClicked && !isNeighbor(row, col)) // If the flag is not a neighbor
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
        setGameFinished(true);
      }
    }
    // Incorrect country
    else {
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
    <div className="flex justify-center">
      <div className="w-[900px] h-[600px] overflow-hidden border-b-2 border-r-2">
        <div className="grid grid-cols-6 grid-rows-6 w-full h-full">
          {gridCountries.map((rowArray, rowIndex) =>
            rowArray.map((id, colIndex) => (
              <div
                key={id}
                className={`w-full h-full border-t-2 border-l-2 ${
                  clickedFlagColors[id] === "green"
                    ? "bg-green-300"
                    : clickedFlagColors[id] === "red"
                    ? "bg-red-300"
                    : "bg-blue-300"
                }`}
                onClick={() => flagClick(rowIndex, colIndex)}
              >
                {allCountries[id]?.name || "Unknown Country"}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default FlagGrid;
