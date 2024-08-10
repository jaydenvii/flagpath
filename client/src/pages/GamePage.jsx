import React from "react";
import { useState, useEffect } from "react";
import FlagGrid from "../components/FlagGrid";
import countryData from "../countries.json";

const GamePage = () => {
  const firstCountry = "PRT";
  const lastCountry = "BLR";

  const [allCountries, setAllCountries] = useState({});

  const [loading, setLoading] = useState(true);

  // Load all countries' data
  useEffect(() => {
    setAllCountries(countryData);
    setLoading(false);
  }, []);

  return (
    <div>
      <h1 className="pt-4 mb-8 text-6xl text-center">FLAGPATH</h1>
      <p className="mt-10 mb-4 text-4xl text-center">
        Go from <span className="text-blue-300 font-bold ">{firstCountry}</span>{" "}
        to <span className="text-red-300 font-bold ">{lastCountry}</span>
      </p>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <FlagGrid
          allCountries={allCountries}
          firstCountry={firstCountry}
          lastCountry={lastCountry}
        />
      )}
    </div>
  );
};

export default GamePage;
