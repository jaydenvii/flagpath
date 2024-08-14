import React, { useState, useEffect } from "react";
import Axios from "axios";
import FlagGrid from "../components/FlagGrid";
import GameEndModal from "../components/GameEndModal";
import countryData from "../countries.json";

const HomePage = () => {
  const [allCountries, setAllCountries] = useState({});
  const [firstCountry, setFirstCountry] = useState("");
  const [lastCountry, setLastCountry] = useState("");
  const [gridCountries, setGridCountries] = useState([[]]);
  const [gameState, setGameState] = useState("running");
  const [finishedLives, setFinishedLives] = useState(3);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Load all countries' data from countries.json and fetch grids from backend
  useEffect(() => {
    // Load country data
    setAllCountries(countryData);

    // Fetch grid data from backend
    const fetchDailyData = async () => {
      try {
        const response = await Axios.get("http://localhost:3001/getGrids");
        const dailyData = response.data[0];

        if (dailyData) {
          setFirstCountry(dailyData.firstCountry);
          setLastCountry(dailyData.lastCountry);
          setGridCountries(dailyData.gridCountries);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDailyData();
  }, []);

  // Handles the modal when the game ends
  const handleGameEnd = (state, lives) => {
    setGameState(state);
    setFinishedLives(lives);
    setShowModal(true);
  };

  // Gets the name of the country from the id
  const getCountryName = (countryId) => {
    return countryData[countryId]?.name || "Unknown Country";
  };

  return (
    <div>
      {/* Header */}
      <h1 className="pt-4 mb-8 text-6xl text-center">🎌FlagPath</h1>
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
          {/* Modal */}
          {showModal && (
            <GameEndModal
              isOpen={showModal}
              onClose={() => setShowModal(false)}
              gameState={gameState}
              finishedLives={finishedLives}
            />
          )}
        </>
      )}
    </div>
  );
};

export default HomePage;
