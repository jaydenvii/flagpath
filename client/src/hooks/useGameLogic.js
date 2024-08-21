import { useState, useEffect, useCallback, useMemo } from "react";
import Axios from "axios";
import countryData from "../countries.json";

const useGameLogic = () => {
  // General game
  const [totalGrids, setTotalGrids] = useState(0);

  // Before the player does anything
  const initialGridState = {
    currCountry: "",
    currCountryIndex: -1,
    firstCountryClicked: false,
    correctClickedFlags: [],
    incorrectClickedFlags: [],
    preFirstGuessMistakes: [],
    postFirstGuessMistakes: [],
    lives: 3,
  };

  // Specific grid
  const [gameState, setGameState] = useState("running");
  const [gridId, setGridId] = useState(-1);
  const [gridCountries, setGridCountries] = useState([[]]);
  const [countryOrder, setCountryOrder] = useState([]);
  const [firstCountry, setFirstCountry] = useState("");
  const [lastCountry, setLastCountry] = useState("");
  const [currCountry, setCurrCountry] = useState(initialGridState.currCountry);
  const [currCountryIndex, setCurrCountryIndex] = useState(
    initialGridState.currCountryIndex
  );
  const [firstCountryClicked, setFirstCountryClicked] = useState(
    initialGridState.firstCountryClicked
  );
  const [correctClickedFlags, setCorrectClickedFlags] = useState(
    initialGridState.correctClickedFlags
  );
  const [incorrectClickedFlags, setIncorrectClickedFlags] = useState(
    initialGridState.incorrectClickedFlags
  );
  const [preFirstGuessMistakes, setPreFirstGuessMistakes] = useState(
    initialGridState.preFirstGuessMistakes
  );
  const [postFirstGuessMistakes, setPostFirstGuessMistakes] = useState(
    initialGridState.postFirstGuessMistakes
  );
  const [lives, setLives] = useState(initialGridState.lives);

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

  // Loads all data on reload
  useEffect(() => {
    loadNewGrid(gridId);
  }, []);

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

  // Load all countries' data from countries.json and fetch grids from backend
  const loadNewGrid = (newGridId) => {
    // Fetch grid data from backend
    const fetchDailyData = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL;
        const response = await Axios.get(apiUrl);
        let targetGridId = newGridId;

        // If the newGridId is -1, default to the latest one
        if (targetGridId === -1) {
          targetGridId = response.data.length - 1;
        }

        const dailyData = response.data[targetGridId];

        if (dailyData) {
          // General reset
          resetGame();

          // Specific to the grid
          setGridId(targetGridId + 1);
          setGridCountries(dailyData.gridCountries);
          setCountryOrder(dailyData.countryOrder);
          setFirstCountry(dailyData.countryOrder[0]);
          setLastCountry(
            dailyData.countryOrder[dailyData.countryOrder.length - 1]
          );
          setTotalGrids(response.data.length);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchDailyData();
  };

  // Non-specific reset of a grid
  const resetGame = () => {
    const {
      currCountry,
      currCountryIndex,
      firstCountryClicked,
      correctClickedFlags,
      incorrectClickedFlags,
      preFirstGuessMistakes,
      postFirstGuessMistakes,
      lives,
    } = initialGridState;

    setCurrCountry(currCountry);
    setCurrCountryIndex(currCountryIndex);
    setFirstCountryClicked(firstCountryClicked);
    setCorrectClickedFlags(correctClickedFlags);
    setIncorrectClickedFlags(incorrectClickedFlags);
    setPreFirstGuessMistakes(preFirstGuessMistakes);
    setPostFirstGuessMistakes(postFirstGuessMistakes);
    setLives(lives);
  };

  // Gets the name of the country from the id
  const getCountryName = useCallback((countryId) => {
    return countryData[countryId]?.name || "Unknown Country";
  }, []);

  // Handles the modal when the player picks a new grid
  const handleGridPick = useCallback((newGridId) => {
    loadNewGrid(newGridId);
  }, []);

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
      displayFlagAsIncorrect(id);

      if (firstCountryClicked) {
        setPostFirstGuessMistakes((prev) => [...prev, id]);
      } else {
        setPreFirstGuessMistakes((prev) => [...prev, id]);
      }
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

  // Adds a red tint to a flag for 1 second to show an incorrect guess
  const displayFlagAsIncorrect = (id) => {
    setIncorrectClickedFlags((prev) => [...prev, id]);
    setTimeout(() => {
      setIncorrectClickedFlags((prev) =>
        prev.filter((flagId) => flagId !== id)
      );
    }, 1000);
  };

  return {
    gameState,
    totalGrids,
    gridId,
    gridCountries,
    countryOrder,
    firstCountry,
    lastCountry,
    preFirstGuessMistakes,
    postFirstGuessMistakes,
    lives,
    currCountry,
    flagImageMap,
    getCountryName,
    handleGridPick,
    flagClick,
    isNeighbor,
    correctClickedFlags,
    incorrectClickedFlags,
  };
};

export default useGameLogic;
