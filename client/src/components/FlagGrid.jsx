import React from "react";
import { useState, useEffect } from "react";

const FlagGrid = () => {
  const firstCountry = "AF";
  const firstCountryClicked = false;
  const lastCountry = "";
  const [allCountries, setAllCountries] = useState([]);
  const [gridCountries, setGridCountries] = useState([]);
  const gameFinished = false;
  const [loading, setLoading] = useState(true);

  // Getting all countries' data
  useEffect(() => {
    const fetchAllCountries = async () => {
      const apiUrl = "/api/countries";

      try {
        const res = await fetch(apiUrl);
        const data = await res.json();
        setAllCountries(data);
      } catch (error) {
        console.log("Error fetching countries' data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllCountries();
  }, []);

  const flagClick = (country) => {
    if (!firstCountryClicked && country.id === firstCountry) {
      console.log("First country clicked");
    } else if (country.id === lastCountry) {
      console.log("Game finished");
      gameFinished = true;
    }
    console.log(country.name);
  };

  return (
    <div className="flex justify-center">
      <div className="w-[900px] h-[600px] overflow-hidden border-b-2 border-r-2">
        <div className="grid grid-cols-6 grid-rows-6 w-full h-full">
          {allCountries.map((country) => (
            <div
              key={country.id}
              className="bg-blue-200 w-full h-full border-t-2 border-l-2"
              onClick={() => flagClick(country)}
            >
              {country.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FlagGrid;
