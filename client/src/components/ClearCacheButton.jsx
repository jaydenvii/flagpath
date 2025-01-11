import React, { useState } from "react";

function ClearCacheButton() {
  const [clickedOnce, setClickedOnce] = useState(false);

  const handleClick = () => {
    if (clickedOnce) {
      localStorage.setItem("playedGrids", []); // Resets progress
      setClickedOnce(false);
      window.location.reload();
    } else {
      setClickedOnce(true);

      setTimeout(() => setClickedOnce(false), 5000); // Reset after 5 secs
    }
  };

  return (
    <div className="flex justify-center mt-4">
      <button
        className={`px-3 py-1 -mt-3 mb-6 rounded ${
          clickedOnce
            ? "bg-yellow-500 hover:bg-yellow-400 text-gray-800"
            : "bg-red-500 hover:bg-red-400"
        }`}
        onClick={handleClick}
      >
        {clickedOnce ? "Are you sure?" : "Reset Progress"}
      </button>
    </div>
  );
}

export default ClearCacheButton;
