import React, {  useState } from "react";
import add_btn from "../Apps/images/plus.svg";
import right_arrow from "../Apps/images/right-arrow.svg";

import ArrowDown_btn from "../Apps/images/Arrow Down 1.svg";
import "./Presentations.css";
import CastingScreensDropdown from "../CastingScreenDropdown/CastingScreensDropdown";
import { useNavigate } from "react-router-dom";

function Presentations() {
    let [opendropdown, setOpenDropDown] = useState("");
  let navigate = useNavigate();
  function OpenDropDown(container) {
    setOpenDropDown(container);
  }
  return (
    <div className="Apps_Parent">
      <div className="topheader">
        <img
          src={add_btn}
          alt="close_btn"
          className="Apps_Plus_Btn"
          onClick={() => navigate("/addpresentation")}
        />
        <span id="presentation_heading"><b>Select Presentation</b></span>
        <img
          src={right_arrow}
          alt="Right_Arrow"
          className="Apps_RightArrow_Btn"
          onClick={() => navigate("/multipleapps")}
        />
        {/* <span className="Apps_Header_Content">Apps</span> */}
      </div>
      <div
        className="Apps_Screens_Header"
        onClick={() => OpenDropDown("Dropdown-1")}
      >
        <p className="Apps_Screens_Header_Content">P1</p>
        {/* <img
          src={ArrowDown_btn}
          alt="ArrowDown_btn"
          className="ArrowDown_btn"
          style={
            opendropdown === "Dropdown-1"
              ? { transform: "rotate(180deg)" }
              : { transform: "rotate(0deg)" }
          }
        /> */}
      </div>
      <div
        className="Dropdown-1"
        style={
          opendropdown === "Dropdown-1" ? { height: "auto" } : { height: "0%" }
        }
      >
        {/* <CastingScreensDropdown opendropdown={opendropdown} tvNumber={1}/> */}
      </div>
      <div
        className="Apps_Screens_Header"
        onClick={() => OpenDropDown("Dropdown-2")}
      >
        <p className="Apps_Screens_Header_Content">P2</p>
        {/* <img
          src={ArrowDown_btn}
          alt="ArrowDown_btn"
          className="ArrowDown_btn"
          style={
            opendropdown === "Dropdown-2"
              ? { transform: "rotate(180deg)" }
              : { transform: "rotate(0deg)" }
          }
        /> */}
      </div>
      <div
        className="Dropdown-2"
        style={
          opendropdown === "Dropdown-2" ? { height: "auto" } : { height: "0%" }
        }
      >
        {/* <CastingScreensDropdown opendropdown={opendropdown} tvNumber={2}/> */}
      </div>
    </div>
  );
}

export default Presentations