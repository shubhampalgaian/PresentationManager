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

  function transformData(data) {
    return data.map(item => ({
      device_ip: item.deviceIp,
      device_name: item.deviceName,
      urls: item.urls
    }));
  }

  let interval 

  useEffect(() => {
    const fetchData = async () => {
      // Initialize count state
      const initialState = {};
      for (let i = 1; i <= tvs.length; i++) {
        initialState[`tv${i}`] = 0;
      }
      setCount(initialState);
    };

    fetchData();
    transformedData = transformData(tvs);
    console.log(transformedData);    
  }, []);


  async function countIncreament() {

    await CEORoomcastcall(count)

    interval = setInterval(() => {
      const newCount = {};
      Object.keys(count).forEach((key, i) => {
        newCount[key] = count[key] >= tvs[i].urls.length - 1 ? 0 : count[key] + 1;
      });

      console.log(newCount);
      setCount(newCount)
      CEORoomcastcall(newCount);
    }, 80000);
  }
  

  function CEORoomcastcall(count) {
    console.log("inside CEORoomcastcall------------------------");
  
    const payload = Object.keys(count).map((key, i) => ({
      device_ip: tvs[i].deviceIp,
      device_name: tvs[i].deviceName,
      url: tvs[i].urls[count[key]]
    }));
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
  


  function navigateToApps() {
    console.log("inside log------------");
    navigate("/");
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
        <button onClick={countIncreament}>
          Let's cast it yeay!
        </button>
        <button onClick={() => clearInterval(interval)}>
          Stop It!
        </button>
      </div>
    </div>
  );
}

export default MultipleAPPS;
