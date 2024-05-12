import React from "react";

const TV = ({ tvNumber, name, onSelect, selectedTV, columnId, urls }) => {
  const tvStyle = selectedTV === tvNumber ? { border: "2px solid red" } : {};

  return (
    <div
      className="tv"
      style={tvStyle}
      onClick={() => onSelect(tvNumber, columnId)}
    >
      <p className="Apps_Screens_Header_Content">
        {name ? name : `TV${tvNumber}`}
      </p>
    </div>
  );
};

export default TV;
