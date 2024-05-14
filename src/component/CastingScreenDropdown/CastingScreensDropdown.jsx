import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import firebaseService from "../../firebaseService";
import "./castingscreendropdown.scss";
import { Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const CastingScreensDropdown = ({
  selectedTV,
  tvNumber,
  columns,
  selectedCol,
}) => {
  const location = useLocation();
  const [selectedUrls, setSelectedUrls] = useState([]);
  const [newUrl, setNewUrl] = useState();
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

  const initialUrls = {
    "b2b": [
      {"AmplyFund": "https://amplyfund.aidtaas.com/"},
      {"Museo": "https://museo.aidtaas.com/"},
      {"Revee": "https://revee.aidtaas.com/"},
      {"Impressio": "https://impressio.aidtaas.com/"}
    ],
    "b2c": [
      {"HearHere": "https://hearhere.aidtaas.com/"},
      {"Mo": "https://mo.aidtaas.com/"},
      {"Izak": "https://izak.aidtaas.com/"},
      {"Around": "https://around.aidtaas.com/"}
    ],
    "b2g": [
      {"VoteIQ": "http://voteiq.aidtaas.com/"},
      {"Aegis": "https://aegis.aidtaas.com/"},
      {"Clink": "https://clink.aidtaas.com/"}
    ],
    "xpx": [
      {"XPX Main": "https://xpx.aidtaas.com/"},
      {"VoxaV2 Dashboard": "https://xpx.aidtaas.com/voxaV2/dashboard"},
      {"Adwize Dashboard": "https://xpx.aidtaas.com/adwize/dashboard"},
      {"Moscribe Dashboard": "https://xpx.aidtaas.com/moscribe/dashboard/Home"}
    ],
    "portals": [
      {"PI Portal": "http://pi.aidtaas.com"},
      {"Bob Portal": "http://bob.aidtaas.com"},
      {"Dev Monet": "http://dev-monet.gaiansolutions.com"},
      {"Holcracy": "http://holcracy.aidtaas.com"}
    ]
  };

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

  // Function to handle adding a new URL
  const handleAddUrl = (e) => {
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
          placeholder="Enter Name to shown"
          value={newUrl}
          onChange={(e) => setNewUrl(e.target.value)}
          onKeyPress={handleAddUrl}
        />

      <input
          type="text"
          placeholder="Enter URL"
          value={newUrl}
          onChange={(e) => setNewUrl(e.target.value)}
          onKeyPress={handleAddUrl}
        />
      </div>
      <div className="castingscreen-dropdown">
        {Object.entries(initialUrls).map(([category, urls]) => (
          <Accordion key={category}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`${category}-content`}
              id={`${category}-header`}
            >
              <Typography>{category}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <ul>
                {urls.map((item) => (
                  <li key={Object.keys(item)[0]}>
                    <input
                      type="checkbox"
                      className="urlcheckbox"
                      id={Object.values(item)[0]}
                      checked={selectedUrls.includes(Object.values(item)[0])}
                      onChange={() => handleCheckboxChange(Object.values(item)[0])}
                    />
                    <label htmlFor={Object.values(item)[0]}>{Object.keys(item)[0]}</label>
                  </li>
                ))}
              </ul>
            </AccordionDetails>
          </Accordion>
        ))}
      </div>
    </>
  );
};

export default CastingScreensDropdown;
