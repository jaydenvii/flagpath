import React, { useState, useEffect } from "react";
import FlagGrid from "../components/FlagGrid";
import TutorialModal from "../components/TutorialModal";
import GameEndModal from "../components/GameEndModal";
import GridPickModal from "../components/GridPickModal";
import Spinner from "../components/Spinner";
import useGameLogic from "../hooks/useGameLogic";

const HomePage = () => {
  const {
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
  } = useGameLogic(-1);

  // UI
  const [loading, setLoading] = useState(true);
  const [showTutorialModal, setShowTutorialModal] = useState(false);
  const [showGameEndModal, setShowGameEndModal] = useState(false);
  const [showGridPickModal, setShowGridPickModal] = useState(false);

  // Loading finishes when the gridId has updated
  useEffect(() => {
    if (gridId !== -1) {
      setLoading(false);
    }
  }, [gridId]);

  // Displays the game end modal when the game is over
  useEffect(() => {
    if (gameState === "won" || gameState === "lost") {
      setShowGameEndModal(true);
    }
  }, [gameState]);

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
        // Spinner
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
              lives={lives}
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
