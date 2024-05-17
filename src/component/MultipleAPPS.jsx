import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./MultiAPPS.scss";
import "../component/grid.css";
import TV from "./TV";
import left_arrow from "../component/Apps/images/left-arrow.svg"

function MultipleAPPS() {
  let navigate = useNavigate();
  const location = useLocation();
  const {column, timer} = location.state;
  console.log("timer : ", timer);
  const { id, name, tvs } = column;
  let transformedData
  const [count, setCount] = useState({});
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
  }, [tvs]);

  async function countIncrement() {
    await CEORoomcastcall(count);
    const id = setInterval(() => {
      setCount(prevCount => {
        const newCount = {};
        Object.keys(prevCount).forEach((key, i) => {
          newCount[key] = prevCount[key] === tvs[i].urls.length - 1 ? 0 : prevCount[key] + 1;
        });
        console.log("inside interval : ", newCount);
        CEORoomcastcall(newCount);
        return newCount;
      });
    }, timer*1000);
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
  
    fetch("http://localhost:4000/receive-data", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        console.log(data, "data------------cast success");
      })
      .catch((error) => console.error("Error:", error));
  }

  function stopCasting() {
    clearInterval(intervalId);
    setIntervalId(null)
    
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
    fetch("http://localhost:4000/receive-data", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        console.log(data, "data------------stop cast success");
      })
      .catch((error) => console.error("Error:", error));
  }

  return (
    <div className="main-container-multiple">
        <button  id="back_to_home_btn" onClick={()=>navigate("/")}><span style={{marginRight:"10px",display:"flex"}}><img src={left_arrow} alt="left_arrow"/></span>Back to Home </button>
      <div className="tvs">
        {tvs?.map((tv, index) => (
          <div className="tv" key={index}>
            <iframe src={tv.urls[0]} frameBorder="0"></iframe>
          </div>
        ))}
      </div>
      <div className="btns">
        <button onClick={countIncrement} disabled={intervalId ? true : false}>
          Let's cast it yeay!
        </button>
        <button onClick={stopCasting}>Stop It!</button>
      </div>
    </div>
  );
}

export default MultipleAPPS;
