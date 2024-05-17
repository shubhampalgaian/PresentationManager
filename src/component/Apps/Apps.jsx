import React, { useState, useEffect } from "react";
import "./Apps.scss";
import CastingScreensDropdown from "../CastingScreenDropdown/CastingScreensDropdown";
import { UpdateDevicesModal, DeviceModal } from "./Modal";
import Column from "../Column.jsx";
import firebaseService from "../../firebaseService.js"
import generateRandomId from "../randomIdGenerator.js";

const Apps = () => {
  const [columns, setColumns] = useState([]);
  const [selectedTV, setSelectedTV] = useState(null);
  const [selectedCol, setSelectedCol] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalColumnIndex, setModalColumnIndex] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [devices, setDevices] = useState([]);
  const [filteredDevices, setFilteredDevices] = useState(devices);

  useEffect(() => {
    localStorage.setItem("appData", JSON.stringify(columns));
    console.log("Columns changed:", columns);
  }, [devices]);

  useEffect(() => {
    const fetchColumns = async () => {
      const fetchedColumns = await firebaseService.getColumnsFromFirestore();const fetchedDevice = await firebaseService.getDeviceFromFireStore()
      setColumns(fetchedColumns);
      setDevices(fetchedDevice);
    };
    fetchColumns();
  }, []);

  const addColumn = () => {
    const newId = columns.length + 1;
    setColumns((prevColumns) => {
      const newColumn = {
        id: generateRandomId(8),
        name: `Column ${newId}`,
        tvs: [],
      };
      const updatedColumns = [...prevColumns, newColumn];
      return updatedColumns;
    });
  };

  const saveToFirebase = () => {
    firebaseService.saveColumnsToFirestore(columns);
  };

  const handleTVSelect = (tvNumber, columnId) => {
    setSelectedTV(tvNumber);
    setSelectedCol(columnId);
    console.log(`Clicked TV ${tvNumber} in column ${selectedCol}`);
  };

  const addTV = (columnIndex) => {
    setIsModalOpen(true);
    setModalColumnIndex(columnIndex);
  };

  const handleDeviceSelect = (selectedDevice) => {
    const columnIndex = modalColumnIndex;
    const newTVNumber = generateRandomId(8);
    const updatedColumns = [...columns];
    updatedColumns[columnIndex].tvs.push({
      tvNumber: newTVNumber,
      selected: false,
      deviceName: selectedDevice.name,
      deviceIp: selectedDevice.ip,
    });
    setColumns(updatedColumns);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalColumnIndex(null);
  };

  const removeColumn = (columnId) => {
    const updatedColumns = columns.filter((column) => column.id !== columnId);
    const data = firebaseService.deleteColumnFromFirestore(columnId);
    console.log("data : ", data);
    setColumns(updatedColumns);
  };
  

  const updateColumnName = (columnId, newName) => {
    setColumns(
      columns.map((column) => {
        if (column.id === columnId) {
          return { ...column, name: newName };
        }
        return column;
      })
    );
  };

  const handleOpenUpdateModal = () => {
    setIsUpdateModalOpen(true);
  };

  const handleCloseUpdateModal = () => {
    setIsUpdateModalOpen(false);
  };

  const handleUpdateDevices = async (updatedDevices) => {
    await setDevices((prevDevices) => [...prevDevices, ...updatedDevices]);
    // setFilteredDevices((prevDevices) => [...prevDevices, ...updatedDevices]); 
    firebaseService.addDevices(updatedDevices);
    console.log("Updated devices:", updatedDevices);
  };

  const handleTVremoval = (tvNumber, columnId) => {
    // console.log("inside handleTVremoval");
    // console.log("columns:", columns);
    // console.log("columnId:", columnId);
    // console.log("tvNumber:", tvNumber);

    const clone = [...columns];

    const columnIndex = clone.findIndex(column => column.id === columnId);

    if (columnIndex !== -1) {
        console.log("inside delete : ", clone[columnIndex]);
        clone[columnIndex].tvs = clone[columnIndex].tvs.filter(tv => tv.tvNumber !== tvNumber);
        setColumns(clone);
    } else {
        console.log(`Column with id ${columnId} does not exist.`);
    }
};

  return (
    <div className="Apps_Parent">
      <div className="add-btn">
        <button onClick={addColumn}>Add Column</button>
        <button onClick={handleOpenUpdateModal}>Update Devices</button>
        <button onClick={saveToFirebase}>Save to Firebase</button>
      </div>
      <div className="leftside columns-container">
        {columns.map((column, index) => (
          <Column
            column={column}
            key={column.id}
            id={column.id}
            name={column.name}
            tvs={column.tvs}
            onAddTV={() => addTV(index)}
            onSelect={(tvNumber) => handleTVSelect(tvNumber, column.id)}
            onRemove={() => removeColumn(column.id)}
            onColumnNameChange={updateColumnName}
            selectedTV={selectedTV}
            handleTVremoval={handleTVremoval}
          />
        ))}
      </div>
      {selectedTV && 
      <div className="rightside url-box">
        {selectedTV ? (
          <CastingScreensDropdown
            selectedTV={selectedTV}
            setSelectedTV={setSelectedTV}
            columns={columns}
            selectedCol={selectedCol}
          />
        ) : (
          "Please select a TV"
        )}

        <button className="save-btn" onClick={() => setSelectedTV(null)}>Save</button>
      </div>}

      <DeviceModal
        open={isModalOpen}
        onClose={handleCloseModal}
        devices={devices}
        onDeviceSelect={handleDeviceSelect}
        // onSearchDevice={handleSearchDevice} 
      />

      <UpdateDevicesModal
        open={isUpdateModalOpen}
        onClose={handleCloseUpdateModal}
        onUpdateDevices={handleUpdateDevices}
      />
    </div>
  );
};

export default Apps;
