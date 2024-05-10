import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import firebaseService from "../../firebaseService";
import "./castingscreendropdown.css";
import "./castingscreendropdown.scss";

const CastingScreensDropdown = ({
  selectedTV,
  tvNumber,
  columns,
  selectedCol,
}) => {
  const location = useLocation();
  const [selectedUrls, setSelectedUrls] = useState([]);
  const [newUrl, setNewUrl] = useState("");
  const [websiteUrls, setWebsiteUrls] = useState([
    "https://around.aidtaas.com/",
    "https://izak.aidtaas.com",
    "https://museo.aidtaas.com/",
    "https://revee.aidtaas.com/",
    "https://clink.aidtaas.com/",
    "https://cerebro.aidtaas.com/",
    "https://cerebro.aidtaas.com/BoardSummary/303/AM",
    "https://cerebro.aidtaas.com/BoardSummary/280/BU",
    "https://cerebro.aidtaas.com/BoardSummary/399/MAW%20board",
    "https://cerebro.aidtaas.com/BoardSummary/372/MORR",
    "https://cerebro.aidtaas.com/BoardSummary/292/PIR",
  ]);

  useEffect(() => {
    const columnIdx = columns.findIndex((col) => col.id === selectedCol);
    if (columnIdx !== -1) {
      const tvIdx = columns[columnIdx].tvs.findIndex(
        (tv) => tv.tvNumber === selectedTV
      );
      if (tvIdx !== -1) {
        setSelectedUrls(columns[columnIdx].tvs[tvIdx].urls || []);
      } else {
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

    const columnIdx = columns.findIndex((col) => col.id === selectedCol);
    if (columnIdx !== -1) {
      const tvIdx = columns[columnIdx].tvs.findIndex(
        (tv) => tv.tvNumber === selectedTV
      );
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
    // firebaseService.addURLs([newUrl]);
  }, []);

  // Function to handle adding a new URL
  const handleAddUrl = (e) => {
    // debugger
    if (e.key === "Enter") {
      firebaseService.addURLs([newUrl]);
      setWebsiteUrls((prevurls) => [...prevurls, newUrl]);
      setNewUrl("");
    }
  };

  return (
    <>
      <div className="url-input">
        <input
          type="text"
          placeholder="Enter URL and press Enter"
          value={newUrl}
          onChange={(e) => setNewUrl(e.target.value)}
          onKeyPress={handleAddUrl}
        />
      </div>
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
    </>
  );
};

export default CastingScreensDropdown;
