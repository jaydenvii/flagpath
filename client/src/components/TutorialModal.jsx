import React from "react";

const TutorialModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="bg-gray-800 fixed inset-0 bg-opacity-70 flex items-center justify-center">
      <div className="bg-gray-900 p-8 rounded-lg relative border-2 border-gray-200">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-0 right-2 hover:text-gray-200 text-4xl"
        >
          &times;
        </button>
        {/* Modal Content */}
        <h2 className="text-3xl font-bold mb-4">Tutorial</h2>
      </div>
    </div>
  );
};

export default TutorialModal;
