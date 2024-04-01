import { useState } from "react";

const useFilter = (data, fields) => {
  const [value, setValue] = useState("");

  const setValidatedValue = (value) => {
    if (typeof value === "string") {
      setValue(value);
    }
  };

  let filteredData = data;
  if (value) {
    filteredData = data.filter((item) => {
      return fields.some((field) => {        
        if (!item[field]) return false;
        return (
          item[field].toString().toLowerCase().indexOf(value.toLowerCase()) > -1
        );
      });
    });
  }

  return {
    data: filteredData,
    filterValue: value,
    setFilterValue: setValidatedValue,
  };
};

export default useFilter;