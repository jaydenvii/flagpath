import { useState, useEffect, useCallback, useMemo } from "react";
import Axios from "axios";
import countryData from "../countries.json";

const useGameLogic = () => {
  // General game
  const [totalGrids, setTotalGrids] = useState(0);

  // Before the player does anything
  const initialState = {
    gameProgress: "running",
    gridId: -1,
    currCountry: "",
    currCountryIndex: -1,
    firstCountryClicked: false,
    correctClickedFlags: [],
    incorrectClickedFlags: [],
    preFirstGuessMistakes: [],
    postFirstGuessMistakes: [],
    lives: 3,
  };

  // Combined state for the game
  const [gameState, setGameState] = useState(initialState);

  // Additional state
  const [gridCountries, setGridCountries] = useState([[]]);
  const [countryOrder, setCountryOrder] = useState([]);
  const [firstCountry, setFirstCountry] = useState("");
  const [lastCountry, setLastCountry] = useState("");

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
    loadNewGrid(gameState.gridId);
  }, [gameState.gridId]);

  // Updates currCountry when currCountryIndex changes
  useEffect(() => {
    setGameState((prevState) => ({
      ...prevState,
      currCountry: countryOrder[gameState.currCountryIndex] || "",
    }));
  }, [gameState.currCountryIndex, countryOrder]);

  // Monitors for when the player hits 0 lives
  useEffect(() => {
    if (gameState.lives === 0) {
      setGameState((prevState) => ({
        ...prevState,
        gameState: "lost",
      }));
    }
  }, [gameState.lives]);

  // Load all countries' data from countries.json and fetch grids from backend
  const loadNewGrid = (newGridId) => {
    const fetchDailyData = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL;
        const response = await Axios.get(apiUrl);
        let targetGridId = newGridId;

        if (targetGridId === -1) {
          targetGridId = response.data.length - 1;
        }

        const dailyData = response.data[targetGridId];

        if (dailyData) {
          resetGame();

          setGameState((prevState) => ({
            ...prevState,
            gridId: targetGridId + 1,
          }));
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
    setGameState(initialState);
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

    if (
      gameState.correctClickedFlags.includes(id) ||
      (gameState.firstCountryClicked && !isNeighbor(row, col)) ||
      gameState.gameProgress === "won" ||
      gameState.gameProgress === "lost"
    ) {
      return;
    }

    if (!gameState.firstCountryClicked && id === firstCountry) {
      setGameState((prevState) => ({
        ...prevState,
        firstCountryClicked: true,
        currCountryIndex: 0,
      }));
      displayFlagAsCorrect(id);
    } else if (
      gameState.firstCountryClicked &&
      id === countryOrder[gameState.currCountryIndex + 1]
    ) {
      setGameState((prevState) => ({
        ...prevState,
        currCountryIndex: prevState.currCountryIndex + 1,
      }));
      displayFlagAsCorrect(id);

      if (id === lastCountry) {
        setGameState((prevState) => ({
          ...prevState,
          gameState: "won",
        }));
      }
    } else {
      setGameState((prevState) => ({
        ...prevState,
        lives: prevState.lives - 1,
      }));
      displayFlagAsIncorrect(id);

      if (gameState.firstCountryClicked) {
        setGameState((prevState) => ({
          ...prevState,
          postFirstGuessMistakes: [...prevState.postFirstGuessMistakes, id],
        }));
      } else {
        setGameState((prevState) => ({
          ...prevState,
          preFirstGuessMistakes: [...prevState.preFirstGuessMistakes, id],
        }));
      }
    }
  };

  // Checks if the clicked flag is adjacent to the current flag on the grid
  const isNeighbor = (row, col) => {
    const currPosition = findPosition(gameState.currCountryIndex);
    if (!currPosition) return false;

    const [currRow, currCol] = currPosition;

    const neighbors = [
      [currRow - 1, currCol],
      [currRow + 1, currCol],
      [currRow, currCol - 1],
      [currRow, currCol + 1],
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
    setGameState((prevState) => ({
      ...prevState,
      correctClickedFlags: [...prevState.correctClickedFlags, id],
    }));
  };

  // Adds a red tint to a flag for 1 second to show an incorrect guess
  const displayFlagAsIncorrect = (id) => {
    setGameState((prevState) => ({
      ...prevState,
      incorrectClickedFlags: [...prevState.incorrectClickedFlags, id],
    }));
    setTimeout(() => {
      setGameState((prevState) => ({
        ...prevState,
        incorrectClickedFlags: prevState.incorrectClickedFlags.filter(
          (flagId) => flagId !== id
        ),
      }));
    }, 1000);
  };

  return {
    ...gameState,
    totalGrids,
    gridCountries,
    countryOrder,
    firstCountry,
    lastCountry,
    flagImageMap,
    getCountryName,
    handleGridPick,
    flagClick,
    isNeighbor,
  };
};

export default useGameLogic;
