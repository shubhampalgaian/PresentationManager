import React, { useState, useEffect } from "react";
import { useLocation} from "react-router-dom";
import firebaseService from "../../firebaseService";
import "./castingscreendropdown.scss";
import closeBtn from "../Apps/images/cross.png"
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  MenuItem,
  Select,
  TextField,
  Button,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useLoaderContext } from "../../utils/LoaderContext";
import toast from "react-hot-toast";

const CastingScreensDropdown = ({
  setSelectedTV,
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
  const { toggleLoader, isLoading } = useLoaderContext();

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
    const fetchUrls = async () => {
      const urls = await firebaseService.getURLsFromFireStore();
      setWebsiteUrls(urls);
    };
    fetchUrls();
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
        console.log("columns : ", updatedColumns);
      }
    }
  };

  const handleAddUrl = async () => {
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
      toggleLoader(true);
      await firebaseService.saveURLs(updatedUrls);
      toggleLoader(false);
      toast.success("Saved URL");

      setNewUrl("");
      setNewUrlDisplayName("");
      setNewCategory("");
      setSelectedCategory("");
      setNewUrlError(false);
      setNewUrlDisplayNameError(false);
      setNewCategoryError(false);
    }
  };

  const handleRemoveCategory = async (category) => {
    console.log("category : ", category);
    const clone = { ...websiteUrls };
    delete clone[category];
    setWebsiteUrls(clone);
    toggleLoader(true)
    await firebaseService.removeCategory(category);
    toggleLoader(false);
    toast.success("Removed category");
  };

  const handleRemoveURL = async (urlDisplayName, category) => {
    console.log("Removing URL:", urlDisplayName, "from category:", category);
    const clone = { ...websiteUrls };

    if (clone[category]) {
      clone[category] = clone[category].filter(urlEntry => !(urlDisplayName in urlEntry));

      setWebsiteUrls(clone);

      toggleLoader(true);
      await firebaseService.removeURL(urlDisplayName, category);
      toggleLoader(false);
      toast.success("Removed URL");
    }
  };

  return (
    <>
    <div id="closeContainer" onClick={() => setSelectedTV(null)}>
    <button type="button" id="close_btn">Close</button>
    <img src={closeBtn} alt="close_btn" id="close_cross"/>
    </div>
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
              <button
                className="summaryBtns"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveCategory(category);
                }}
              >
                Delete Category
              </button>
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
                      onChange={() =>
                        handleCheckboxChange(Object.values(item)[0])
                      }
                    />
                    <label htmlFor={Object.values(item)[0]}>
                      {Object.keys(item)[0]}
                    </label>
                    <button
                      className="removeUrl"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveURL(Object.keys(item)[0], category);
                      }}
                    >
                      Remove Url
                    </button>
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
