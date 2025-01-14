import React, { useState } from "react";

const ShareButton = ({ gridId, guessOrderText }) => {
  const [buttonText, setButtonText] = useState("Share");

  const copyToClipboard = () => {
    const shareText = `🎌FlagPath #${
      gridId + 1
    }\n${guessOrderText}\nhttps://flagpath.xyz/`;

    navigator.clipboard.writeText(shareText).then(
      () => {
        setButtonText("Copied!");
        setTimeout(() => {
          setButtonText("Share");
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
        className={`px-4 py-2 bg-blue-500 text-white rounded`}
      >
        {buttonText}
      </button>
    </div>
  );
};

export default ShareButton;
