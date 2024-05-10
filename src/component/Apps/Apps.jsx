import React, { useState, useEffect } from "react";
import "./Apps.scss";
import CastingScreensDropdown from "../CastingScreenDropdown/CastingScreensDropdown";
import { UpdateDevicesModal, DeviceModal } from "./Modal";
import Column from "../Column.jsx";
import firebaseService from "../../firebaseService.js"
import generateRandomId from "../randomIdGenerator.js";

const Apps = () => {
  const [columns, setColumns] = useState([
    { id: generateRandomId(8), name: "Column 1", tvs: [] },
  ]);
  const [selectedTV, setSelectedTV] = useState(null);
  const [selectedCol, setSelectedCol] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalColumnIndex, setModalColumnIndex] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [devices, setDevices] = useState([
    { id: 1, name: "Device 1", ip: "192.168.1.1" },
    { id: 2, name: "Device 2", ip: "192.168.1.2" },
  ]);
  const [filteredDevices, setFilteredDevices] = useState(devices); 

  useEffect(() => {
    localStorage.setItem("appData", JSON.stringify(columns));
    console.log("Columns changed:", columns);
  }, [columns]);

  useEffect(() => {
    const fetchColumns = async () => {
      const fetchedColumns = await firebaseService.getColumnsFromFirestore();
      setColumns(fetchedColumns);
    };
    fetchColumns();
    
    setFilteredDevices(devices);
  }, [devices]);

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

  const handleUpdateDevices = (updatedDevices) => {
    setDevices((prevDevices) => [...prevDevices, ...updatedDevices]);
    setFilteredDevices((prevDevices) => [...prevDevices, ...updatedDevices]); 
    console.log("Updated devices:", updatedDevices);
  };

  const handleSearchDevice = (searchTerm) => {
    const filtered = devices.filter(
      (device) =>
        device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        device.ip.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredDevices(filtered);
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
          />
        ))}
      </div>
      <div className="rightside url-box">
        {selectedTV ? (
          <CastingScreensDropdown
            selectedTV={selectedTV}
            columns={columns}
            selectedCol={selectedCol}
          />
        ) : (
          "Please select a TV"
        )}
      </div>

      <DeviceModal
        open={isModalOpen}
        onClose={handleCloseModal}
        devices={filteredDevices}
        onDeviceSelect={handleDeviceSelect}
        onSearchDevice={handleSearchDevice} 
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
