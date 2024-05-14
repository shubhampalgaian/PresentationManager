import React, { useState } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import TV from "./TV";
import { useNavigate } from "react-router-dom";

const Column = ({
  column,
  id,
  name,
  tvs,
  onAddTV,
  onSelect,
  onRemove,
  onColumnNameChange,
  selectedTV,
}) => {
  const [columnName, setColumnName] = useState(name);
  const navigation = useNavigate();
  const [timer, setTimer] = useState(80000)
  const handleNameChange = (e) => {
    const newName = e.target.value;
    setColumnName(newName);
    onColumnNameChange(id, newName);
  };

  return (
    <div className="column">
      <Accordion defaultExpanded>
        <AccordionSummary
          // expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <Typography>
            <div className="col-header">
              <input
                type="text"
                value={columnName}
                onChange={handleNameChange}
              />
              <button onClick={() => onRemove(id)}>remove</button>
            </div>
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          {column && column.tvs && column.tvs.length > 0 && (
            <div className="casting-nav">

              <input type="number" placeholder="Enter time for multicast"
                onChange={(e) => setTimer(e.target.value)}
              />
              <button
                onClick={() =>
                  navigation("multipleapps", { state: { column, timer } })
                }
              >
                Move to casting
              </button>
            </div>
          )}

          <div className="tvs-box">
            {tvs.map((tv) => (
              <TV
                key={tv.tvNumber}
                tvNumber={tv.tvNumber}
                name={tv.deviceName}
                ip={tv.deviceIp}
                onSelect={onSelect}
                selectedTV={selectedTV}
                columnId={id}
                urls={tv.urls}
              />
            ))}
            <button
              className="addtv-btn"
              onClick={() => {
                onAddTV();
              }}
            >
              +
            </button>
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default Column;
