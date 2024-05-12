import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./MultiAPPS.scss";
import "../component/grid.css";
import TV from "./TV";

function MultipleAPPS() {
  let navigate = useNavigate();
  const location = useLocation();
  const column = location.state;
  const { id, name, tvs } = column.column;
  let transformedData
  const [count, setCount] = useState();
  const [initiallyCast, setInitiallyCast] = useState({});
  const [intervalId, setIntervalId] = useState(null);

  function transformData(data) {
    return data.map(item => ({
      device_ip: item.deviceIp,
      device_name: item.deviceName,
      urls: item.urls
    }));
  }

  useEffect(() => {
    const fetchData = async () => {
      const initialState = {};
      for (let i = 1; i <= tvs.length; i++) {
        initialState[`tv${i}`] = 0;
      }
      setCount(initialState);
      
      const initialCastState = {};
      tvs.forEach((tv, i) => {
        initialCastState[`tv${i+1}`] = tv.urls.length === 1;
      });
      setInitiallyCast(initialCastState);
    };

    fetchData();
    transformedData = transformData(tvs);
    console.log(transformedData);    
  }, []);

  async function countIncrement() {
    await CEORoomcastcall(count);
    const id = setInterval(() => {
      const newCount = {};
      Object.keys(count).forEach((key, i) => {
        newCount[key] = count[key] >= tvs[i].urls.length - 1 ? 0 : count[key] + 1;
      });
      setCount(newCount);
      CEORoomcastcall(newCount);
    }, 80000);
    setIntervalId(id);
  }

  function CEORoomcastcall(count) {
    console.log("inside CEORoomcastcall------------------------");
  
    const payload = Object.keys(count).map((key, i) => {
      if (initiallyCast[key]) {
        initiallyCast[key] = false;
        return {
          device_ip: tvs[i].deviceIp,
          device_name: tvs[i].deviceName,
          url: tvs[i].urls[count[key]]
        };
      } else if (tvs[i].urls.length > 1) {
        return {
          device_ip: tvs[i].deviceIp,
          device_name: tvs[i].deviceName,
          url: tvs[i].urls[count[key]]
        };
      }
      return null;
    }).filter(payload => payload !== null);

    console.log("payload : ", payload);
  
    const requestOptions = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload),
    };
  
    fetch("http://localhost:5000/receive-data", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        console.log(data, "data------------cast success");
      })
      .catch((error) => console.error("Error:", error));
  }

  function stopCasting() {
    clearInterval(intervalId);
    
    const payload = Object.keys(count).map((key, i) => ({
      device_ip: tvs[i].deviceIp,
      device_name: tvs[i].deviceName,
      url: tvs[i].urls[count[key]],
      isStop: true
    }));
    
    const requestOptions = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload),
    };
    fetch("http://localhost:5000/receive-data", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        console.log(data, "data------------stop cast success");
      })
      .catch((error) => console.error("Error:", error));
  }

  return (
    <div className="main-container-multiple">
      <div className="tvs">
        {tvs?.map((tv) => (
          <div className="tv">
            <iframe src={tv.urls[0]} frameborder="0"></iframe>
          </div>
        ))}
      </div>
      <div className="btns">
        <button onClick={countIncrement}>
          Let's cast it yeay!
        </button>
        <button onClick={stopCasting}>
          Stop It!
        </button>
      </div>
    </div>
  );
}

export default MultipleAPPS;
