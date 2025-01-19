import React, { useState, useEffect } from "react";
import FlagGrid from "../components/FlagGrid";
import TutorialModal from "../components/TutorialModal";
import GameEndModal from "../components/GameEndModal";
import GridPickModal from "../components/GridPickModal";
import Spinner from "../components/Spinner";
import useGameLogic from "../hooks/useGameLogic";

const HomePage = () => {
  const {
    gameProgress,
    gridId,
    currCountry,
    currCountryIndex,
    firstCountryClicked,
    correctClickedFlags,
    incorrectClickedFlags,
    preFirstGuessMistakes,
    postFirstGuessMistakes,
    guessOrder,
    lives,
    playedGrids,
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
    setGameState,
  } = useGameLogic(-1);

  // UI
  const [loading, setLoading] = useState(true);
  const [showTutorialModal, setShowTutorialModal] = useState(false);
  const [showGameEndModal, setShowGameEndModal] = useState(false);
  const [showGridPickModal, setShowGridPickModal] = useState(false);
  const [showSummaryButton, setShowSummaryButton] = useState(false);
  const [firstVisit, setFirstVisit] = useState(false);

  // Loading finishes when the gridId has updated
  useEffect(() => {
    if (gridId !== -1) {
      setLoading(false);
    }
  }, [gridId]);

  // Checks if the user has visited (to show tutorial modal)
  useEffect(() => {
    const visited = localStorage.getItem("visited");

    if (!visited) {
      setFirstVisit(true);
      localStorage.setItem("visited", "true");
    }
  }, []);

  // Displays the game end modal and summary button
  useEffect(() => {
    if (gameProgress === "won" || gameProgress === "lost") {
      setShowGameEndModal(true);
      setShowSummaryButton(true);
    } else {
      setShowSummaryButton(false);
    }
  }, [gameProgress]);

  // Hides game end modal when changing grids
  useEffect(() => {
    setShowGameEndModal(false);
  }, [gridId]);

  // Resets the progress of only the current grid
  const handleTryAgain = (gridId) => {
    const updatedGrids = playedGrids.map((grid) =>
      grid.gridId === gridId
        ? {
            ...grid,
            gameProgress: "running",
            currCountry: "",
            currCountryIndex: -1,
            firstCountryClicked: false,
            correctClickedFlags: [],
            incorrectClickedFlags: [],
            preFirstGuessMistakes: [],
            postFirstGuessMistakes: [],
            guessOrder: [],
            lives: 3,
          }
        : grid
    );

    localStorage.setItem("playedGrids", JSON.stringify(updatedGrids));
    setGameState(updatedGrids.find((grid) => grid.gridId === gridId));
    setShowGameEndModal(false);
  };

  return (
    <div>
      {/* Header */}
      <h1 className="sm:pt-4 pt-16 mb-8 sm:text-6xl xs:text-5xl text-[2.75rem] text-center">
        🎌FlagPath
        {!loading && (
          <span
            className="ml-4 text-yellow-300 hover:text-cyan-300 underline cursor-pointer"
            onClick={() => setShowGridPickModal(true)}
          >
            #{gridId + 1}
          </span>
        )}
      </h1>
      {/* Tutorial button */}
      <button
        className="absolute top-4 right-4 px-1 py-1 bg-gray-600 hover:bg-slate-400 text-2xl rounded"
        onClick={() => setShowTutorialModal(true)}
      >
        ❓
      </button>
      {/* Bug form button */}
      <button
        className="absolute top-4 right-16 px-1 py-1 bg-gray-600 hover:bg-slate-400 text-2xl rounded"
        onClick={() =>
          window.open(
            "https://forms.gle/czhSXjeTgWByXPUW6",
            "_blank",
            "noopener noreferrer"
          )
        }
      >
        📧
      </button>
      {/* Vertical button container */}
      <div className="flex flex-col h-full justify-between">
        {/* Archive button */}
        <div className="flex justify-center">
          <button
            className="px-3 py-1 sm:text-base text-sm -mt-5 -mb-2 bg-yellow-300 text-gray-800 hover:bg-cyan-300 rounded"
            onClick={() => setShowGridPickModal(true)}
          >
            Play Previous Puzzles
          </button>
        </div>
        {/* Show summary button */}
        {showSummaryButton && (
          <div className="flex justify-center">
            <button
              className="px-3 py-1 sm:text-base text-sm mt-4 -mb-6 bg-gray-500 hover:bg-slate-400 rounded"
              onClick={() => setShowGameEndModal(true)}
            >
              Show Summary
            </button>
          </div>
        )}
      </div>

      {loading ? (
        // Spinner
        <div className="flex flex-col justify-center items-center h-[65vh]">
          <Spinner loading={loading} />
          <p className="mt-2 text-2xl">Loading...</p>
        </div>
      ) : (
        <>
          {/* Instruction text */}
          <p className="mt-10 mb-4 sm:text-4xl xs:text-3xl text-2xl text-center">
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
            gameProgress={gameProgress}
            gridCountries={gridCountries}
            currCountry={currCountry}
            lives={lives}
            correctClickedFlags={correctClickedFlags}
            incorrectClickedFlags={incorrectClickedFlags}
            flagClick={flagClick}
            isNeighbor={isNeighbor}
          />
          {/* Tutorial modal */}
          {(showTutorialModal || firstVisit) && (
            <TutorialModal
              isOpen={showTutorialModal || firstVisit}
              onClose={() => {
                setShowTutorialModal(false);
                setFirstVisit(false);
              }}
            />
          )}
          {/* Game end modal */}
          {showGameEndModal && (
            <GameEndModal
              isOpen={showGameEndModal}
              onClose={() => setShowGameEndModal(false)}
              gridId={gridId}
              gameProgress={gameProgress}
              lives={lives}
              countryOrder={countryOrder}
              preFirstGuessMistakes={preFirstGuessMistakes}
              postFirstGuessMistakes={postFirstGuessMistakes}
              guessOrder={guessOrder}
              getCountryName={getCountryName}
              flagImageMap={flagImageMap}
              onTryAgain={handleTryAgain}
            />
          )}
          {/* Grid pick modal */}
          {showGridPickModal && (
            <GridPickModal
              isOpen={showGridPickModal}
              onClose={() => setShowGridPickModal(false)}
              totalGrids={totalGrids}
              playedGrids={playedGrids}
              onGridPick={handleGridPick}
            />
          )}
        </>
      )}
    </div>
  );
};

export default HomePage;
