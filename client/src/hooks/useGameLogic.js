import { useState, useEffect, useCallback, useMemo } from "react";
import Axios from "axios";
import useLocalStorage from "./useLocalStorage";
import countryData from "../countries.json";

const useGameLogic = () => {
  // Before the player does anything
  const initialState = {
    gridId: -1,
    gridCountries: [],
    countryOrder: [],
    firstCountry: "",
    lastCountry: "",
    gameProgress: "running",
    currCountry: "",
    currCountryIndex: -1,
    firstCountryClicked: false,
    correctClickedFlags: [],
    incorrectClickedFlags: [],
    preFirstGuessMistakes: [],
    postFirstGuessMistakes: [],
    lives: 3,
  };

  // General game
  const [totalGrids, setTotalGrids] = useState(0);
  const [gameState, setGameState] = useState(initialState);
  const [playedGrids, setPlayedGrids] = useLocalStorage("playedGrids", []);

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

  // Get all the grids
  useEffect(() => {
    fetchDailyData();
  }, []);

  // Loads initial grid when all the grid data is fetched
  useEffect(() => {
    if (gameState.gridId === -1) {
      loadNewGrid(gameState.gridId);
    }
  }, [playedGrids]);

  // Loads all data on reload
  useEffect(() => {
    loadNewGrid(gameState.gridId);
  }, [gameState.gridId]);

  // Updates currCountry when currCountryIndex changes
  useEffect(() => {
    setGameState((prevState) => ({
      ...prevState,
      currCountry: gameState.countryOrder[gameState.currCountryIndex] || "",
    }));
  }, [gameState.currCountryIndex]);

  // Monitors for when the player hits 0 lives
  useEffect(() => {
    if (gameState.lives === 0) {
      setGameState((prevState) => ({
        ...prevState,
        gameProgress: "lost",
      }));
    }
  }, [gameState.lives]);

  // Changes the playedGrids array everytime gameState changes
  useEffect(() => {
    if (gameState && playedGrids.length > 0) {
      setPlayedGrids((prevGrids) =>
        prevGrids.map((grid) => {
          if (grid.gridId === gameState.gridId) {
            const updatedGrid = { ...grid };

            // Iterates over each key in gameState and compare with grid
            Object.keys(gameState).forEach((key) => {
              if (gameState[key] !== grid[key]) {
                updatedGrid[key] = gameState[key];
              }
            });

            return updatedGrid;
          }
          return grid;
        })
      );
    }
  }, [gameState]);

  // Fetches all grids from the database
  const fetchDailyData = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await Axios.get(apiUrl);
      const dailyDataArray = response.data;

      setTotalGrids(dailyDataArray.length);

      setPlayedGrids((prevGrids) => {
        const newGrids = dailyDataArray
          .map((data, index) => {
            // Only create new grids when they aren't already in playedGrids
            const gridExists = prevGrids.some((grid) => grid.gridId === index);

            if (!gridExists) {
              return {
                ...initialState,
                gridId: index,
                gridCountries: data.gridCountries,
                countryOrder: data.countryOrder,
                firstCountry: data.countryOrder[0],
                lastCountry: data.countryOrder[data.countryOrder.length - 1],
              };
            }

            return null;
          })
          .filter((grid) => grid !== null);

        return [...prevGrids, ...newGrids];
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Loads the specific grid
  const loadNewGrid = (newGridId) => {
    let targetGridId = newGridId;

    if (targetGridId === -1) {
      targetGridId = playedGrids.length - 1;
    }

    const dailyData = playedGrids[targetGridId];

    if (dailyData) {
      setGameState(dailyData);
    }
  };

  // Gets the name of the country from the id
  const getCountryName = useCallback((countryId) => {
    return countryData[countryId]?.name || "Unknown Country";
  }, []);

  // Handles the modal when the player picks a new grid
  const handleGridPick = (newGridId) => {
    loadNewGrid(newGridId);
  };

  // Handles game progression by clicking on flags
  const flagClick = (row, col) => {
    const id = gameState.gridCountries[row][col];

    if (
      gameState.correctClickedFlags.includes(id) ||
      (gameState.firstCountryClicked && !isNeighbor(row, col)) ||
      gameState.gameProgress === "won" ||
      gameState.gameProgress === "lost"
    ) {
      return;
    }

    if (!gameState.firstCountryClicked && id === gameState.firstCountry) {
      setGameState((prevState) => ({
        ...prevState,
        firstCountryClicked: true,
        currCountryIndex: 0,
      }));
      displayFlagAsCorrect(id);
    } else if (
      gameState.firstCountryClicked &&
      id === gameState.countryOrder[gameState.currCountryIndex + 1]
    ) {
      setGameState((prevState) => ({
        ...prevState,
        currCountryIndex: prevState.currCountryIndex + 1,
      }));
      displayFlagAsCorrect(id);

      if (id === gameState.lastCountry) {
        setGameState((prevState) => ({
          ...prevState,
          gameProgress: "won",
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
    for (let row = 0; row < gameState.gridCountries.length; row++) {
      for (let col = 0; col < gameState.gridCountries[row].length; col++) {
        if (
          gameState.gridCountries[row][col] ===
          gameState.countryOrder[countryId]
        ) {
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
    flagImageMap,
    getCountryName,
    handleGridPick,
    flagClick,
    isNeighbor,
  };
};

export default useGameLogic;
