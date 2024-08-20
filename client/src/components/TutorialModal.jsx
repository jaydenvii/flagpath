import React from "react";

const TutorialModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="bg-gray-800 fixed inset-0 bg-opacity-70 flex items-center justify-center">
      <div className="w-[600px] bg-gray-900 p-8 rounded-lg relative border-2 border-gray-200">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-0 right-2 hover:text-gray-200 text-4xl"
        >
          &times;
        </button>
        {/* Modal Content */}
        <h2 className="text-3xl font-bold mb-4 text-center">How To Play</h2>
        <p className="text-lg mb-4">
          Click on flags to get from the
          <span className="text-blue-300"> first country</span> to the
          <span className="text-red-300"> last country</span>.
        </p>
        <p className="text-lg mb-4">
          After correctly guessing the first flag, you can only click on flags
          that border the current country in the real world.
        </p>
        <h2 className="text-3xl font-bold mb-4 text-center">Borders</h2>
        <p className="text-lg">
          All borders count. This means territories, tunnels, and bridges.
        </p>
      </div>
    </div>
  );
};

export default TutorialModal;
