import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./castingscreendropdown.css";

const CastingScreensDropdown = ({ selectedTV, tvNumber, columns, selectedCol }) => {
  const location = useLocation();
  const [selectedUrls, setSelectedUrls] = useState([]);const websiteUrls = [
    "https://cerebro.aidtaas.com/",
    "https://cerebro.aidtaas.com/BoardSummary/303/AM",
    "https://cerebro.aidtaas.com/BoardSummary/280/BU",
    "https://cerebro.aidtaas.com/BoardSummary/399/MAW%20board",
    "https://cerebro.aidtaas.com/BoardSummary/372/MORR",
    "https://cerebro.aidtaas.com/BoardSummary/292/PIR",
  ];

  useEffect(() => {
    // When a new TV is selected, update the selected URLs if they exist for that TV
    const columnIdx = columns.findIndex((col) => col.id === selectedCol);
    if (columnIdx !== -1) {
      const tvIdx = columns[columnIdx].tvs.findIndex((tv) => tv.tvNumber === selectedTV);
      if (tvIdx !== -1) {
        setSelectedUrls(columns[columnIdx].tvs[tvIdx].urls || []);
      } else {
        // If the selected TV has no URLs, reset the selected URLs
        setSelectedUrls([]);
      }
    }
  }, [selectedTV, selectedCol, columns]);

  const handleCheckboxChange = (url) => {
    setSelectedUrls((prevSelected) =>
      prevSelected.includes(url)
        ? prevSelected.filter((selectedUrl) => selectedUrl !== url)
        : [...prevSelected, url]
    );

    // Update the URLs array in the TV data
    const columnIdx = columns.findIndex((col) => col.id === selectedCol);
    if (columnIdx !== -1) {
      const tvIdx = columns[columnIdx].tvs.findIndex((tv) => tv.tvNumber === selectedTV);
      if (tvIdx !== -1) {
        const updatedColumns = [...columns];
        updatedColumns[columnIdx].tvs[tvIdx].urls = selectedUrls.includes(url)
          ? selectedUrls.filter((selectedUrl) => selectedUrl !== url)
          : [...selectedUrls, url];
        // Update the state of columns with the new TV data
        columns = updatedColumns;
        console.log("columns : ", columns);
      }
    }
  };

  useEffect(() => {
    // Update localStorage when selected URLs change
    if (location.pathname === "/") {
      localStorage.setItem(`tv${tvNumber}`, JSON.stringify(selectedUrls));
    }
  }, [selectedUrls, tvNumber, location.pathname]);

  return (
    <div className="castingscreen-dropdown">
      {websiteUrls.map((url) => (
        <li key={url}>
          <input
            type="checkbox"
            className="urlcheckbox"
            id={url}
            checked={selectedUrls.includes(url)}
            onChange={() => handleCheckboxChange(url)}
          />
          <label htmlFor={url}>{url}</label>
        </li>
      ))}
    </div>
  );
};

export default CastingScreensDropdown;
