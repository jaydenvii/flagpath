import React from "react";

const TryAgainButton = ({ gridId, onTryAgain }) => {
  const handleClick = () => {
    onTryAgain(gridId);
  };

  return (
    <div className="flex justify-center mt-4">
      <button
        className={"px-4 py-2 rounded bg-red-500 hover:bg-red-400"}
        onClick={handleClick}
      >
        Try Again
      </button>
    </div>
  );
};

export default TryAgainButton;
