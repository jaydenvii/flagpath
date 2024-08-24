import { useState, useEffect, useCallback, useMemo } from "react";
import Axios from "axios";
import useLocalStorage from "./useLocalStorage";
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
  const [playedGrids, setPlayedGrids] = useLocalStorage("playedGrids", []);

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
    handleGameStateChange(
      "currCountry",
      countryOrder[gameState.currCountryIndex] || ""
    );
  }, [gameState.currCountryIndex, countryOrder]);

  // Monitors for when the player hits 0 lives
  useEffect(() => {
    if (gameState.lives === 0) {
      handleGameStateChange("gameProgress", "lost");
    }
  }, [gameState.lives]);

  // Handle value changes for the current grid
  const handleGameStateChange = (key, updateFn) => {
    setGameState((prevState) => {
      // Checks if the updateFn is a callback or a plain value
      const newValue =
        typeof updateFn === "function" ? updateFn(prevState[key]) : updateFn;

      const updatedGameState = { ...prevState, [key]: newValue };

      setPlayedGrids((prev) =>
        prev.map((grid) =>
          grid.gridId === updatedGameState.gridId
            ? { ...grid, [key]: newValue }
            : grid
        )
      );

      return updatedGameState;
    });
  };

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

          const updatedGameState = {
            ...gameState,
            gridId: targetGridId,
          };

          setGameState(updatedGameState);
          setGridCountries(dailyData.gridCountries);
          setCountryOrder(dailyData.countryOrder);
          setFirstCountry(dailyData.countryOrder[0]);
          setLastCountry(
            dailyData.countryOrder[dailyData.countryOrder.length - 1]
          );
          setTotalGrids(response.data.length);

          // Add the entire updated gameState to playedGrids
          setPlayedGrids((prevPlayedGrids) => {
            const isGridAlreadyPlayed = prevPlayedGrids.some(
              (grid) => grid.gridId === updatedGameState.gridId
            );
            if (!isGridAlreadyPlayed) {
              return [...prevPlayedGrids, updatedGameState];
            }
            return prevPlayedGrids;
          });
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
      handleGameStateChange("firstCountryClicked", true);
      handleGameStateChange("currCountryIndex", 0);
      displayFlagAsCorrect(id);
    } else if (
      gameState.firstCountryClicked &&
      id === countryOrder[gameState.currCountryIndex + 1]
    ) {
      handleGameStateChange("currCountryIndex", (prev) => prev + 1);
      displayFlagAsCorrect(id);

      if (id === lastCountry) {
        handleGameStateChange("gameProgress", "won");
      }
    } else {
      handleGameStateChange("lives", (prev) => prev - 1);
      displayFlagAsIncorrect(id);

      if (gameState.firstCountryClicked) {
        handleGameStateChange("postFirstGuessMistakes", (prev) => [
          ...prev,
          id,
        ]);
      } else {
        handleGameStateChange("preFirstGuessMistakes", (prev) => [...prev, id]);
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
    handleGameStateChange("correctClickedFlags", (prev) => [...prev, id]);
  };

  // Adds a red tint to a flag for 1 second to show an incorrect guess
  const displayFlagAsIncorrect = (id) => {
    handleGameStateChange("incorrectClickedFlags", (prev) => [...prev, id]);
    setTimeout(() => {
      handleGameStateChange("incorrectClickedFlags", (prev) =>
        prev.filter((flagId) => flagId !== id)
      );
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
