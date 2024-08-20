import React from "react";

const MistakeFlags = ({
  preFirstGuessMistakes,
  postFirstGuessMistakes,
  flagImageMap,
  getCountryName,
}) => {
  return (
    <div>
      <p className="text-2xl text-center mt-4">Mistakes:</p>
      <div className="flex justify-center flex-wrap gap-2">
        {/* Mistakes before the first correct guess */}
        {preFirstGuessMistakes.map((countryId, index) => (
          <div
            key={`${countryId}-pre-${index}`} // Unique key combining countryId and index
            className="flex flex-col justify-between p-2 w-[150px] rounded text-center bg-gray-700"
          >
            <p className="flex-grow">
              {index + 1}. {getCountryName(countryId)}*
            </p>
            <img
              src={flagImageMap[countryId]}
              alt={getCountryName(countryId)}
              className="border"
            />
          </div>
        ))}
        {/* Mistakes after hte first correct guess */}
        {postFirstGuessMistakes.map((countryId, index) => (
          <div
            key={`${countryId}-post-${index}`} // Unique key combining countryId and index
            className="flex flex-col justify-between p-2 w-[150px] rounded text-center bg-gray-700"
          >
            <p className="flex-grow">
              {index + 1 + preFirstGuessMistakes.length}.{" "}
              {getCountryName(countryId)}
            </p>
            <img
              src={flagImageMap[countryId]}
              alt={getCountryName(countryId)}
              className="border"
            />
          </div>
        ))}
      </div>
      {/* Text explaining the asterisks */}
      {preFirstGuessMistakes.length > 0 && (
        <p className="text-center">
          * = a mistake made before your first correct guess.
        </p>
      )}
    </div>
  );
};

export default MistakeFlags;
