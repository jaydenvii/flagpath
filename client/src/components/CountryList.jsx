import React from "react";

const CountryList = ({
  title,
  countries,
  flagImageMap,
  getCountryName,
  highlightFirstAndLast,
}) => {
  return (
    <div>
      <p className="text-2xl text-center mt-4 -2">{title}:</p>
      <div className="flex justify-center flex-wrap gap-2">
        {countries.map((countryId, index) => {
          const isFirstCountry = !highlightFirstAndLast && index === 0;
          const isLastCountry =
            !highlightFirstAndLast && index === countries.length - 1;

          return (
            <div
              key={countryId}
              className={`flex flex-col justify-between p-2 w-[150px] rounded text-center ${
                highlightFirstAndLast
                  ? "bg-gray-700"
                  : isFirstCountry
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

export default CountryList;
