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
  console.log("column in multiple app: ", id, name, tvs);
  
  const handleCast = () => {
    const interval = setInterval(() => {
      setCount((prev) => {
        const newCount = {
          ...prev,
          tv1: prev.tv1 === tvUrls.tv1.length - 1 ? 0 : prev.tv1 + 1,
          tv2: prev.tv2 === tvUrls.tv2.length - 1 ? 0 : prev.tv2 + 1,
          tv3: prev.tv3 === tvUrls.tv3.length - 1 ? 0 : prev.tv3 + 1,
          tv4: prev.tv4 === tvUrls.tv4.length - 1 ? 0 : prev.tv4 + 1,
          tv5: prev.tv5 === tvUrls.tv5.length - 1 ? 0 : prev.tv5 + 1,
        };
        CEORoomcastcall(newCount);
        return newCount;
      });
    }, 80000);
  }

  const [count, setCount] = useState();
  const [tvUrls, setTvUrls] = useState();

  function transformData(data) {
    return data.map(item => ({
      device_ip: item.deviceIp,
      device_name: item.deviceName,
      urls: item.urls
    }));
  }

  useEffect(() => {
    const fetchData = async () => {
      // Initialize count state
      const initialState = {};
      for (let i = 1; i <= tvs.length; i++) {
        initialState[`tv${i}`] = 0;
      }
      setCount(initialState);
  
      // Initialize tvUrls state
      const initialStateOfUrls = {};
      tvs.forEach((tv, index) => {
        initialStateOfUrls[`tv${index + 1}`] = tv.urls || []; 
      });
      setTvUrls(initialStateOfUrls);
    };

    transformedData = transformData(tvs);
    console.log(transformedData);
    fetchData();


    
  }, []);


  function countIncreament() {
    const interval = setInterval(() => {
      const newCount = {};
      Object.keys(count).forEach((key, i) => {
        newCount[key] = count[key] === tvs[i].urls.length - 1 ? 0 : count[key] + 1;
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

    fetch(
      "http://localhost:5000/receive-data",
      requestOptions
    )
      .then((response) => {
        console.log("here");
        return countIncreament()
        response.json()})
      .then((data) => {
        console.log(data, "data------------cast success")}
    
    )
      .catch((error) => console.error("Error:", error));
  }


  function navigateToApps() {
    console.log("inside log------------");
    navigate("/");
  }

  return (
    <div className="main-container-multiple">
      <div className="tvs">
      {tvs?.map(tv => (
        <div
          className="tv"
        >
          <iframe src={tv.urls[0]} frameborder="0"></iframe>
        </div>
      ))
      }
      </div>
      <div className="btns"><button onClick={() => CEORoomcastcall(count)}>Let's cast it yeay!</button></div>
    </div>
  );
}

export default MultipleAPPS;
