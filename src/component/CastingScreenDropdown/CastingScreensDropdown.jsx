import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import firebaseService from "../../firebaseService";
import "./castingscreendropdown.scss";
import { Accordion, AccordionSummary, AccordionDetails, Typography, MenuItem, Select, TextField, Button } from '@mui/material';
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
  const [newUrlDisplayNameError, setNewUrlDisplayNameError] = useState(false);
  const [newCategoryError, setNewCategoryError] = useState(false);
  const [newUrl, setNewUrl] = useState("");
  const [newUrlDisplayName, setNewUrlDisplayName] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [websiteUrls, setWebsiteUrls] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("");

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
    const updatedSelectedUrls = selectedUrls.includes(url)
      ? selectedUrls.filter((selectedUrl) => selectedUrl !== url)
      : [...selectedUrls, url];

    setSelectedUrls(updatedSelectedUrls);

    const columnIdx = columns.findIndex((col) => col.id === selectedCol);
    if (columnIdx !== -1) {
      const tvIdx = columns[columnIdx].tvs.findIndex(
        (tv) => tv.tvNumber === selectedTV
      );
      if (tvIdx !== -1) {
        const updatedColumns = [...columns];
        updatedColumns[columnIdx].tvs[tvIdx].urls = updatedSelectedUrls;
        // Update the state of columns with the new TV data
        // Pass the updatedColumns to the parent component if needed
        console.log("columns : ", updatedColumns);
      }
    }
  };

  const handleAddUrl = () => {
    let hasError = false;
    if (!selectedCategory && !newCategory) {
      setNewCategoryError(true);
      hasError = true;
    }
    if (!newUrl) {
      setNewUrlError(true);
      hasError = true;
    }
    if (!newUrlDisplayName) {
      setNewUrlDisplayNameError(true);
      hasError = true;
    }

    if (!hasError) {      
      const categoryToUse = newCategory || selectedCategory;
      const updatedUrls = { ...websiteUrls };

      if (updatedUrls[categoryToUse]) {
        // Category exists, add new URL to it
        updatedUrls[categoryToUse].push({ [newUrlDisplayName]: newUrl });
      } else {
        // Category doesn't exist, create new category and add URL to it
        updatedUrls[categoryToUse] = [{ [newUrlDisplayName]: newUrl }];
      }

      console.log("website URL : ", updatedUrls);
      setWebsiteUrls(updatedUrls);

      setNewUrl("");
      setNewUrlDisplayName("");
      setNewCategory("");
      setSelectedCategory("");
      setNewUrlError(false);
      setNewUrlDisplayNameError(false);
      setNewCategoryError(false);
    }
  };

  return (
    <>
      <div className="url-input">
        <div className="url-input-child">
          <Select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              if (newCategoryError && e.target.value) {
                setNewCategoryError(false);
              }
            }}
            displayEmpty
          >
            <MenuItem value="" disabled>
              Select Category
            </MenuItem>
            {Object.keys(websiteUrls).map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </Select>
          <Typography>OR</Typography>
          <TextField
            type="text"
            placeholder="Enter New Category"
            value={newCategory}
            onChange={(e) => {
              setNewCategory(e.target.value);
              if (newCategoryError && e.target.value) {
                setNewCategoryError(false);
              }
            }}
            error={newCategoryError}
            helperText={newCategoryError && "Enter Category"}
          />
        </div>
        <div className="url-input-child">
          <TextField
            type="text"
            placeholder="Enter Display Name"
            value={newUrlDisplayName}
            onChange={(e) => {
              setNewUrlDisplayName(e.target.value);
              if (newUrlDisplayNameError && e.target.value) {
                setNewUrlDisplayNameError(false);
              }
            }}
            error={newUrlDisplayNameError}
            helperText={newUrlDisplayNameError && "Enter Display Name"}
          />
        </div>
        <div className="url-input-child">
          <TextField
            type="text"
            placeholder="Enter URL"
            value={newUrl}
            onChange={(e) => {
              setNewUrl(e.target.value);
              if (newUrlError && e.target.value) {
                setNewUrlError(false);
              }
            }}
            error={newUrlError}
            helperText={newUrlError && "Enter URL"}
          />
        </div>
        <Button onClick={handleAddUrl}>Add</Button>
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
