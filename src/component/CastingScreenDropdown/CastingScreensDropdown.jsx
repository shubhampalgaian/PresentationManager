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
  const [newUrlError, setNewUrlError] = useState(false);
  const [newUrlDisplayNameError, setnewUrlDisplayNameError] = useState(false);
  const [newCategoryError, setnewCategoryError] = useState(false);
  const [newUrl, setNewUrl] = useState("");
  const [newUrlDisplayName, setNewUrlDisplayName] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [websiteUrls, setWebsiteUrls] = useState({});

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

  useEffect(() => {
    setWebsiteUrls(initialUrls);
  }, []);

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

  const handleAddUrl = () => {
    if (newCategory && newUrl && newUrlDisplayName) {
      setWebsiteUrls((prevUrls) => {
        const updatedUrls = { ...prevUrls };

        if (updatedUrls[newCategory]) {
          // Category exists, add new URL to it
          updatedUrls[newCategory].push({ [newUrlDisplayName]: newUrl });
        } else {
          // Category doesn't exist, create new category and add URL to it
          updatedUrls[newCategory] = [{ [newUrlDisplayName]: newUrl }];
        }

        firebaseService.addURLs([{ [newUrlDisplayName]: newUrl }]);
        return updatedUrls;
      });

      setNewUrl("");
      setNewUrlDisplayName("");
      setNewCategory("");
    } else if(newUrl.length > 0) {
      setNewUrlError(true);
    } else if(newUrlDisplayName.length > 0) {
      setnewUrlDisplayNameError(true);
    } else if(newCategory.length > 0) {
      setnewCategoryError(true);
    }
  };

  return (
    <>
      <div className="url-input">
        <input
          type="text"
          placeholder="Enter Display Name"
          value={newUrlDisplayName}
          onChange={(e) => setNewUrlDisplayName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter URL"
          value={newUrl}
          onChange={(e) => setNewUrl(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter Category"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        />
        
        <p>Enter url</p>
        <p>Enter category</p>
        <button onClick={handleAddUrl}>Add</button>
      </div>
      <div className="castingscreen-dropdown">
        {Object.entries(websiteUrls).map(([category, urls]) => (
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
