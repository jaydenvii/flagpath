import React from "react";

const CorrectPathFlags = ({ countries, flagImageMap, getCountryName }) => {
  return (
    <div>
      <p className="text-2xl text-center mt-4">Correct Path:</p>
      <div className="flex justify-center flex-wrap gap-2">
        {countries.map((countryId, index) => {
          const isFirstCountry = index === 0;
          const isLastCountry = index === countries.length - 1;

          return (
            <div
              key={`${countryId}-${index}`} // Unique key combining countryId and index
              className={`flex flex-col justify-between p-2 w-[125px] sm:w-[150px] rounded text-center ${
                isFirstCountry
                  ? "bg-blue-500"
                  : isLastCountry
                  ? "bg-red-500"
                  : "bg-gray-700"
              }`}
            >
              <p className="flex-grow">
                {index + 1}. {getCountryName(countryId)}
              </p>
              <img
                src={flagImageMap[countryId]}
                alt={getCountryName(countryId)}
                className="border"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CorrectPathFlags;
