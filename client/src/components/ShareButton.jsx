import React, { useState } from "react";

const ShareButton = ({ gridId, finishedLives, checkMarks, crosses }) => {
  const [buttonText, setButtonText] = useState("Share");
  const [buttonColor, setButtonColor] = useState("bg-gray-600");

  const copyToClipboard = () => {
    const shareText = `🎌FlagPath #${gridId}\n${finishedLives}/3\n${checkMarks}${crosses}\nhttps://flagpath.com/`;

    navigator.clipboard.writeText(shareText).then(
      () => {
        setButtonText("Copied!");
        setButtonColor("bg-blue-500");
        setTimeout(() => {
          setButtonText("Share");
          setButtonColor("bg-gray-600");
        }, 2000); // Reset button text and color after 2 seconds
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
        className={`px-4 py-2 ${buttonColor} text-white rounded`}
      >
        {buttonText}
      </button>
    </div>
  );
};

export default ShareButton;
