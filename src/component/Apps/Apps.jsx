import React, { useState, useEffect } from "react";
import "./Apps.scss";
import CastingScreensDropdown from "../CastingScreenDropdown/CastingScreensDropdown";
import DeviceModal from "./Modal";
import Column from "../Column.jsx";
const generateRandomId = require("../randomIdGenerator.js");

const Apps = () => {
  const [columns, setColumns] = useState([
    { id: generateRandomId(8), name: "Column 1", tvs: [] },
  ]);
  const [selectedTV, setSelectedTV] = useState(null);
  const [selectedCol, setSelectedCol] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalColumnIndex, setModalColumnIndex] = useState(null);

  const devices = [
    { id: 1, name: "Device 1", ip: "192.168.1.1" },
    { id: 2, name: "Device 2", ip: "192.168.1.2" },
    { id: 3, name: "Device 3", ip: "192.168.1.3" },
    { id: 4, name: "Device 4", ip: "192.168.1.4" },
    { id: 5, name: "Device 5", ip: "192.168.1.5" },
    { id: 6, name: "Device 6", ip: "192.168.1.6" },
    { id: 7, name: "Device 7", ip: "192.168.1.7" },
    { id: 8, name: "Device 8", ip: "192.168.1.8" },
    { id: 9, name: "Device 9", ip: "192.168.1.9" },
    { id: 10, name: "Device 10", ip: "192.168.1.10" },
    { id: 11, name: "Device 11", ip: "192.168.1.11" },
    { id: 12, name: "Device 12", ip: "192.168.1.12" },
    { id: 13, name: "Device 13", ip: "192.168.1.13" },
    { id: 14, name: "Device 14", ip: "192.168.1.14" },
    { id: 15, name: "Device 15", ip: "192.168.1.15" },
    { id: 16, name: "Device 16", ip: "192.168.1.16" },
    { id: 17, name: "Device 17", ip: "192.168.1.17" },
    { id: 18, name: "Device 18", ip: "192.168.1.18" },
    { id: 19, name: "Device 19", ip: "192.168.1.19" },
    { id: 20, name: "Device 20", ip: "192.168.1.20" },
    { id: 21, name: "Device 21", ip: "192.168.1.21" },
    { id: 22, name: "Device 22", ip: "192.168.1.22" },
    { id: 23, name: "Device 23", ip: "192.168.1.23" },
    { id: 24, name: "Device 24", ip: "192.168.1.24" },
    { id: 25, name: "Device 25", ip: "192.168.1.25" },
    { id: 26, name: "Device 26", ip: "192.168.1.26" },
    { id: 27, name: "Device 27", ip: "192.168.1.27" },
  ];

  useEffect(() => {
    localStorage.setItem("appData", JSON.stringify(columns));
    console.log("Columns changed:", columns);
  }, [columns]);

  const handleTVSelect = (tvNumber, columnId) => {
    setSelectedTV(tvNumber);
    setSelectedCol(columnId);
    console.log(`Clicked TV ${tvNumber} in column ${selectedCol}`);
  };

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

  return (
    <div className="Apps_Parent">
      <div className="add-btn">
        <button onClick={addColumn}>Add Column</button>
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
        devices={devices}
        onDeviceSelect={handleDeviceSelect}
      />
    </div>
  );
};

export default Apps;
