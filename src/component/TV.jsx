import React from "react";
import close from "../close.png"
import "./TV.css"
import firebaseService from "../firebaseService";


const TV = ({ tvNumber, name, onSelect, selectedTV, columnId, urls, handleTVremoval }) => {
  const tvStyle = selectedTV === tvNumber ? { border: "2px solid red" } : {};

  return (
    <div
      className="tv"
      style={tvStyle}
      onClick={() => onSelect(tvNumber, columnId)}
    >
      <img className="removeTv" src={close} alt="cross" onClick={(e) => {
        e.stopPropagation();
        firebaseService.removeTV(tvNumber, columnId);
        handleTVremoval(tvNumber, columnId)
        return ;
      }}/>
      <p className="Apps_Screens_Header_Content">
        {name ? name : `TV${tvNumber}`}
      </p>
    </div>
  );
};

export default TV;
