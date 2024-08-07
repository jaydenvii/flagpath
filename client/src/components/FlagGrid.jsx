import React from "react";
import { useState, useEffect } from "react";
import countryData from "../countries.json";

const FlagGrid = () => {
  const firstCountry = "PRT";
  const [firstCountryClicked, setFirstCountryClicked] = useState(false);
  const [currCountry, setCurrCountry] = useState("");
  const [prevCountry, setPrevCountry] = useState("");
  const lastCountry = "BLR";
  const [allCountries, setAllCountries] = useState({});
  const [gridCountries, setGridCountries] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const [clickedFlagColors, setClickedFlagColors] = useState({});
  const [loading, setLoading] = useState(true);

  // Setting all countries' data
  useEffect(() => {
    setAllCountries(countryData);

    setGridCountries([
      "AFG",
      "AGO",
      "ALB",
      "PRT",
      "ARE",
      "BGR",
      "ARG",
      "FRA",
      "AND",
      "ESP",
      "ARM",
      "BHR",
      "CAN",
      "BEL",
      "ATG",
      "AUS",
      "BHS",
      "AUT",
      "AZE",
      "NLD",
      "DEU",
      "CZE",
      "SVK",
      "BIH",
      "BDI",
      "BEN",
      "BFA",
      "BGD",
      "UKR",
      "MNG",
      "COL",
      "CUBA",
      "CRI",
      "CPV",
      "BLR",
      "MOZ",
    ]);
  }, []);

  // Handles game progression by clicking on flags
  const flagClick = (id) => {
    // First correct country
    if (!firstCountryClicked && id === firstCountry) {
      setFirstCountryClicked(true);
      setCurrCountry(firstCountry);

      changeFlagColor(id, "green");
    }
    // Subsequent correct countries
    else if (
      firstCountryClicked &&
      allCountries[currCountry].borders.includes(id) &&
      id != prevCountry
    ) {
      setPrevCountry(currCountry);
      setCurrCountry(id);

      changeFlagColor(id, "green");

      if (id === lastCountry) {
        setGameFinished(true);
      }
    }
    // Incorrect country
    else {
      changeFlagColor(id, "red");
    }
  };

  // Changes the flags' colours to show a correct/incorrect guess
  const changeFlagColor = (id, color) => {
    setClickedFlagColors((prev) => ({
      ...prev,
      [id]: color,
    }));
  };

  return (
    <div className="flex justify-center">
      <div className="w-[900px] h-[600px] overflow-hidden border-b-2 border-r-2">
        <div className="grid grid-cols-6 grid-rows-6 w-full h-full">
          {gridCountries.map((id) => (
            <div
              key={id}
              className={`w-full h-full border-t-2 border-l-2 ${
                clickedFlagColors[id] === "green"
                  ? "bg-green-300"
                  : clickedFlagColors[id] === "red"
                  ? "bg-red-300"
                  : "bg-blue-300"
              }`}
              onClick={() => flagClick(id)}
            >
              {allCountries[id]?.name || "Unknown Country"}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FlagGrid;
