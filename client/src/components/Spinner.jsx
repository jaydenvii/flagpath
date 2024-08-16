import React from "react";
import GridLoader from "react-spinners/GridLoader";

const Spinner = ({ loading }) => {
  return <GridLoader color="#F3F4F6" loading={loading} size={30} />;
};

export default Spinner;
