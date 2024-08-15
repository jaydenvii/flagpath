import React, { useState, useEffect } from "react";
import Axios from "axios";
import FlagGrid from "../components/FlagGrid";
import GameEndModal from "../components/GameEndModal";
import GridPickModal from "../components/GridPickModal";
import countryData from "../countries.json";

const HomePage = () => {
  const [gridId, setGridId] = useState(-1);
  const [firstCountry, setFirstCountry] = useState("");
  const [lastCountry, setLastCountry] = useState("");
  const [gridCountries, setGridCountries] = useState([[]]);

  const [allCountries, setAllCountries] = useState({});
  const [gameState, setGameState] = useState("running");
  const [finishedLives, setFinishedLives] = useState(3);
  const [totalGrids, setTotalGrids] = useState(0);

  const [loading, setLoading] = useState(true);
  const [showGameEndModal, setShowGameEndModal] = useState(false);
  const [showGridPickModal, setShowGridPickModal] = useState(false);

  // Load all countries' data from countries.json and fetch grids from backend
  useEffect(() => {
    loadNewGrid(gridId);
  }, []);

  // Load all countries' data from countries.json and fetch grids from backend
  const loadNewGrid = (newGridId) => {
    // Load country data
    setAllCountries(countryData);

    // Fetch grid data from backend
    const fetchDailyData = async () => {
      try {
        const response = await Axios.get("http://localhost:3001/getGrids");
        let targetGridId = newGridId;

        // If the newGridId is -1, default to the latest one
        if (targetGridId === -1) {
          targetGridId = response.data.length - 1;
        }

        const dailyData = response.data[targetGridId];

        if (dailyData) {
          setGridId(targetGridId + 1);
          setFirstCountry(dailyData.firstCountry);
          setLastCountry(dailyData.lastCountry);
          setGridCountries(dailyData.gridCountries);
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
  const getCountryName = (countryId) => {
    return countryData[countryId]?.name || "Unknown Country";
  };

  // Handles the modal when the game ends
  const handleGameEnd = (state, lives) => {
    setGameState(state);
    setFinishedLives(lives);
    setShowGameEndModal(true);
  };

  // Handles the modal when the player picks a new grid
  const handleGridPick = (newGridId) => {
    loadNewGrid(newGridId);
    setShowGridPickModal(false);
  };

  return (
    <div>
      {/* Header */}
      <h1 className="pt-4 mb-8 text-6xl text-center">
        🎌FlagPath
        <span
          className="ml-4 text-yellow-300 hover:text-cyan-300 underline cursor-pointer"
          onClick={() => setShowGridPickModal(true)}
        >
          #{gridId}
        </span>
      </h1>
      {loading ? (
        <div>Loading...</div>
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
          <FlagGrid
            allCountries={allCountries}
            firstCountry={firstCountry}
            lastCountry={lastCountry}
            gridCountries={gridCountries}
            onGameEnd={handleGameEnd}
          />
          {/* Game end modal */}
          {showGameEndModal && (
            <GameEndModal
              isOpen={showGameEndModal}
              onClose={() => setShowGameEndModal(false)}
              gameState={gameState}
              finishedLives={finishedLives}
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
