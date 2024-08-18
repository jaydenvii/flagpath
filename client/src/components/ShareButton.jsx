import React, { useState } from "react";

const ShareButton = ({ gridId, finishedLives, checkMarks, crosses }) => {
  const [buttonText, setButtonText] = useState("Share");

  const copyToClipboard = () => {
    const shareText = `🎌FlagPath #${gridId}\n${finishedLives}/3\n${checkMarks}${crosses}\nhttps://flagpath.com/`;

    navigator.clipboard.writeText(shareText).then(
      () => {
        setButtonText("Copied!");
        setTimeout(() => setButtonText("Copy Text"), 2000); // Reset button text after 2 seconds
      },
      (err) => {
        alert("Failed to copy: ", err);
      }
    );
  };

  return (
    <div className="flex justify-center mt-4">
      <button
        onClick={copyToClipboard}
        className="px-4 py-2 bg-gray-600 text-white rounded"
      >
        {buttonText}
      </button>
    </div>
  );
};

export default ShareButton;
