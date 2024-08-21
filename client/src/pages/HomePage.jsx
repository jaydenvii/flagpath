import React, { useState, useEffect, useCallback, useMemo } from "react";
import Axios from "axios";
import FlagGrid from "../components/FlagGrid";
import TutorialModal from "../components/TutorialModal";
import GameEndModal from "../components/GameEndModal";
import GridPickModal from "../components/GridPickModal";
import Spinner from "../components/Spinner";
import countryData from "../countries.json";

const HomePage = () => {
  // General game
  const [gameState, setGameState] = useState("running");
  const [finishedLives, setFinishedLives] = useState(3);
  const [totalGrids, setTotalGrids] = useState(0);

  // Specific grid
  const [gridId, setGridId] = useState(-1);
  const [gridCountries, setGridCountries] = useState([[]]);
  const [countryOrder, setCountryOrder] = useState([]);
  const [firstCountry, setFirstCountry] = useState("");
  const [lastCountry, setLastCountry] = useState("");
  const [preFirstGuessMistakes, setPreFirstGuessMistakes] = useState([]);
  const [postFirstGuessMistakes, setPostFirstGuessMistakes] = useState([]);

  // UI
  const [loading, setLoading] = useState(true);
  const [showTutorialModal, setShowTutorialModal] = useState(false);
  const [showGameEndModal, setShowGameEndModal] = useState(false);
  const [showGridPickModal, setShowGridPickModal] = useState(false);

  // TAKEN FROM FLAGGRID.JSX
  const [currCountry, setCurrCountry] = useState("");
  const [currCountryIndex, setCurrCountryIndex] = useState(-1);
  const [firstCountryClicked, setFirstCountryClicked] = useState(false);
  const [correctClickedFlags, setCorrectClickedFlags] = useState([]);
  const [incorrectClickedFlags, setIncorrectClickedFlags] = useState([]);
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

  // Loads all data on reload
  useEffect(() => {
    loadNewGrid(gridId);
  }, []);

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
      } finally {
        setLoading(false);
      }
    };

    fetchDailyData();
  };

  // Gets the name of the country from the id
  const getCountryName = useCallback((countryId) => {
    return countryData[countryId]?.name || "Unknown Country";
  }, []);

  // Handles the modal when the game ends
  const handleGameEnd = useCallback(
    (state, lives, preMistakes, postMistakes) => {
      setGameState(state);
      setFinishedLives(lives);
      setPreFirstGuessMistakes(preMistakes);
      setPostFirstGuessMistakes(postMistakes);
      setShowGameEndModal(true);
    },
    []
  );

  // Handles the modal when the player picks a new grid
  const handleGridPick = useCallback((newGridId) => {
    loadNewGrid(newGridId);
    setShowGridPickModal(false);
    resetGame();
  }, []);

  // Resets the game for a new grid
  const resetGame = () => {
    setGameState("running");
  };

  // TAKEN FROM FLAGGRID.JSX
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
      handleGameEnd(
        gameState,
        lives,
        preFirstGuessMistakes,
        postFirstGuessMistakes
      );
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

  return (
    <div>
      {/* Header */}
      <h1 className="pt-4 mb-8 text-6xl text-center">
        🎌FlagPath
        {!loading && (
          <span
            className="ml-4 text-yellow-300 hover:text-cyan-300 underline cursor-pointer"
            onClick={() => setShowGridPickModal(true)}
          >
            #{gridId}
          </span>
        )}
      </h1>
      {/* Tutorial Button */}
      <button
        className="absolute top-4 right-4 px-1 py-1 bg-gray-600 hover:bg-slate-400 text-2xl rounded"
        onClick={() => setShowTutorialModal(true)}
      >
        ❓
      </button>
      {loading ? (
        <div className="flex flex-col justify-center items-center h-[65vh]">
          <Spinner loading={loading} />
          <p className="mt-2 text-2xl">Loading...</p>
        </div>
      ) : (
        <>
          {/* Instruction text */}
          <p className="mt-10 mb-4 text-4xl text-center">
            Go from{" "}
            <span className="text-blue-300 font-bold">
              {getCountryName(firstCountry)}
            </span>{" "}
            to{" "}
            <span className="text-red-300 font-bold">
              {getCountryName(lastCountry)}
            </span>
          </p>
          {/* Grid */}
          {/* flagImageMap,
  gridCountries,
  currCountry,
  currCountryIndex,
  firstCountryClicked,
  correctClickedCountries,
  incorrectClickedCountries,
  lives,
  flagClick,
  isNeighbor,
  findPosition,
  displayFlagAsCorrect,
  displayFlagAsIncorrect, */}
          <FlagGrid
            key={gridId}
            flagImageMap={flagImageMap}
            gameState={gameState}
            gridCountries={gridCountries}
            currCountry={currCountry}
            lives={lives}
            correctClickedFlags={correctClickedFlags}
            incorrectClickedFlags={incorrectClickedFlags}
            flagClick={flagClick}
            isNeighbor={isNeighbor}
          />
          {/* Tutorial modal */}
          {showTutorialModal && (
            <TutorialModal
              isOpen={showTutorialModal}
              onClose={() => setShowTutorialModal(false)}
            />
          )}
          {/* Game end modal */}
          {showGameEndModal && (
            <GameEndModal
              isOpen={showGameEndModal}
              onClose={() => setShowGameEndModal(false)}
              gridId={gridId}
              gameState={gameState}
              finishedLives={finishedLives}
              countryOrder={countryOrder}
              preFirstGuessMistakes={preFirstGuessMistakes}
              postFirstGuessMistakes={postFirstGuessMistakes}
              getCountryName={getCountryName}
              flagImageMap={flagImageMap}
            />
          )}
          {/* Grid pick modal */}
          {showGridPickModal && (
            <GridPickModal
              isOpen={showGridPickModal}
              onClose={() => setShowGridPickModal(false)}
              totalGrids={totalGrids}
              onGridPick={handleGridPick}
            />
          )}
        </>
      )}
    </div>
  );
};

export default HomePage;
