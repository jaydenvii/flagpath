import React from "react";
import { useState, useEffect } from "react";
import FlagGrid from "../components/FlagGrid";
import GameEndModal from "../components/GameEndModal";
import countryData from "../countries.json";

const HomePage = () => {
  const firstCountry = "PRT";
  const lastCountry = "BLR";
  const [allCountries, setAllCountries] = useState({});
  const [gameState, setGameState] = useState("running");
  const [finishedLives, setFinishedLives] = useState(3);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Load all countries' data
  useEffect(() => {
    setAllCountries(countryData);
    setLoading(false);
  }, []);

  // Handles the modal when the game ends
  const handleGameEnd = (state, lives) => {
    setGameState(state);
    setFinishedLives(lives);
    setShowModal(true);
  };

  return (
    <div>
      {/* Header text */}
      <h1 className="pt-4 mb-8 text-6xl text-center">FlagPath</h1>
      <p className="mt-10 mb-4 text-4xl text-center">
        Go from{" "}
        <span className="text-blue-300 font-bold ">
          {countryData[firstCountry].name}
        </span>{" "}
        to{" "}
        <span className="text-red-300 font-bold ">
          {countryData[lastCountry].name}
        </span>
      </p>
      {/* Grid */}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <FlagGrid
          allCountries={allCountries}
          firstCountry={firstCountry}
          lastCountry={lastCountry}
          onGameEnd={handleGameEnd}
        />
      )}
      {/* Modal */}
      {showModal && (
        <GameEndModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          gameState={gameState}
          finishedLives={finishedLives}
        />
      )}
    </div>
  );
};

export default HomePage;
