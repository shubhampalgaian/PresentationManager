import React, { useState, useEffect } from "react";
import Modal from "@mui/material/Modal";
import { makeStyles } from "@mui/styles";
import Paper from "@mui/material/Paper";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import Button from "@mui/material/Button";

const useStyles = makeStyles(() => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    width: 400,
    maxHeight: 600,
    overflowY: "auto",
    padding: 10,
  },
}));

export const DeviceModal = ({ open, onClose, devices, onDeviceSelect }) => {
  const classes = useStyles();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredDevices, setFilteredDevices] = useState(devices);

  useEffect(() => {
    if(searchTerm.length > 0){
      const filtered = devices.filter(
        (device) =>
          device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          device.ip.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredDevices(filtered);
    } else {
      setFilteredDevices(devices)
    }
  }, [searchTerm, devices]);

  const handleClose = () => {
    onClose();
  };

  const handleDeviceSelect = (selectedDevice) => {
    onDeviceSelect(selectedDevice);
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose} className={classes.modal}>
      <Paper className={classes.paper}>
        <h2>Select Device</h2>
        <TextField
          label="Search Device"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="end">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <List>
          {filteredDevices.map((device) => (
            <ListItem
              key={device.id}
              onClick={() => handleDeviceSelect(device)}
            >
              <ListItemText primary={device.name} secondary={device.ip} />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Modal>
  );
};

export const UpdateDevicesModal = ({ open, onClose, onUpdateDevices }) => {
  const classes = useStyles();
  const [jsonData, setJsonData] = useState("");

  const handleClose = () => {
    onClose();
  };

  const handleUpdate = () => {
    try {
      const parsedData = JSON.parse(jsonData);
      onUpdateDevices(parsedData);
      onClose();
    } catch (error) {
      console.error("Error parsing JSON:", error);
    }
  };

  return (
    <Modal open={open} onClose={handleClose} className={classes.modal}>
      <Paper className={classes.paper}>
        <h2>Update Devices with JSON</h2>
        <TextField
          label="Enter JSON Data"
          variant="outlined"
          fullWidth
          multiline
          rows={8}
          value={jsonData}
          onChange={(e) => setJsonData(e.target.value)}
        />
        <Button variant="contained" color="primary" onClick={handleUpdate}>
          Update Devices
        </Button>
      </Paper>
    </Modal>
  );
};