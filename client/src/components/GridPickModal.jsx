import React from "react";
import ClearCacheButton from "./ClearCacheButton";

const GridPickModal = ({
  isOpen,
  onClose,
  totalGrids,
  playedGrids,
  onGridPick,
}) => {
  if (!isOpen) return null;

  return (
    <div className="bg-gray-800 fixed inset-0 bg-opacity-70 flex items-center justify-center overflow-auto">
      <div className="w-[300px] bg-gray-900 p-8 rounded-lg shadow-lg relative border-2 border-gray-200 max-h-full overflow-y-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-0 right-2 hover:text-gray-200 text-4xl"
        >
          &times;
        </button>
        {/* Modal Content */}
        <h2 className="text-3xl font-bold mb-4">Archived Grids</h2>
        <div className="flex justify-center">
          <ClearCacheButton />
        </div>
        {/* List of previous grids */}
        {Array.from({ length: totalGrids }, (_, index) => {
          const gridId = totalGrids - 1 - index;
          const gridData = playedGrids[gridId];
          const correctFlags = gridData.correctClickedFlags;
          const countryOrder = gridData.countryOrder;
          const lives = gridData.lives;
          const percentComplete =
            (correctFlags.length / countryOrder.length) * 100;

          // Color of the percent span
          let spanColor = "text-slate-300";
          let crossedOut = false;
          if (lives === 0) {
            spanColor = "text-red-500";
            crossedOut = true;
          } else if (percentComplete === 100) {
            spanColor = "text-green-500";
          } else if (percentComplete !== 0 || lives !== 3) {
            spanColor = "text-yellow-300";
          }

          return (
            <div
              key={index}
              className="flex justify-center text-xl hover:text-cyan-300 hover:underline cursor-pointer"
              onClick={() => {
                onGridPick(gridId);
                onClose();
              }}
            >
              FlagPath #{totalGrids - index} -&nbsp;
              <span
                className={`${spanColor} ${crossedOut ? "line-through" : ""}`}
              >
                [{percentComplete.toFixed(0)}%]
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GridPickModal;
