import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import "../component/grid.css";

function MultipleAPPS() {
  let navigate = useNavigate();
  const [count, setCount] = useState({
    tv1: 0,
    tv2: 0,
    tv3: 0,
    tv4: 0,
    tv5: 0,
  });
  const [tvUrls, setTvUrls] = useState({
    tv1: JSON.parse(localStorage.getItem("tv1")) || [],
    tv2: JSON.parse(localStorage.getItem("tv2")) || [],
    tv3: JSON.parse(localStorage.getItem("tv3")) || [],
    tv4: JSON.parse(localStorage.getItem("tv4")) || [],
    tv5: JSON.parse(localStorage.getItem("tv5")) || [],
  });

  function CEORoomcastcall(count) {
    console.log("inside CEORoomcastcall------------------------");

    const requestOptions = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify([
        {
          device_ip: "192.168.0.167",
          device_name: "1",
          url: tvUrls.tv1[count.tv1],
          number: 1,
        }
      ]),
    };

    fetch(
      "http://localhost:5000/receive-data",
      requestOptions
    )
      .then((response) => response.json())
      .then((data) => console.log(data, "data------------cast success"))
      .catch((error) => console.error("Error:", error));
  }

  // Inside useEffect
  useEffect(() => {
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

    return () => clearInterval(interval);
  }, [tvUrls]);

  // function startCasting() {
  //   console.log("inside startCasting-----");
  // }

  // function stopCasting() {
  //   console.log("inside stopCasting-----");
  // }

  function navigateToApps() {
    console.log("inside log------------");
    navigate("/");
  }

  return (
    <div className="main-container">
      <div className="left">
        <div className="box">
          <iframe
            title="one"
            style={{
              width: "98%",
              height: "95%",
              margin: "1%",
              overflow: "hidden",
            }}
            src={tvUrls.tv1[count.tv1]}
            scrolling="no"
          />
        </div>
        <div className="box">
          <iframe
            title="two"
            style={{
              width: "98%",
              height: "95%",
              margin: "1%",
              overflow: "hidden",
            }}
            src={tvUrls.tv2[count.tv2]}
            scrolling="no"
          />
        </div>
        <div className="box">
          <iframe
            title="three"
            style={{
              width: "98%",
              height: "95%",
              margin: "1%",
              overflow: "hidden",
            }}
            src={tvUrls.tv3[count.tv3]}
            scrolling="no"
          />
        </div>
        <div className="box">
          <iframe
            title="four"
            style={{
              width: "98%",
              height: "95%",
              margin: "1%",
              overflow: "hidden",
            }}
            src={tvUrls.tv4[count.tv4]}
            scrolling="no"
          />
        </div>
        <div className="box">
          <iframe
            title="five"
            style={{
              width: "98%",
              height: "95%",
              margin: "1%",
              overflow: "hidden",
            }}
            src={tvUrls.tv5[count.tv5]}
            scrolling="no"
          />
        </div>
        {/* Add iframes for other TVs */}
      </div>
      <footer>
        <button id="appconfigBtn" onClick={navigateToApps}>
          Select Multiple APP
        </button>
        {/* <button onClick={stopCasting} id="stopCastBtn">
          Stop Casting
        </button>
        <button onClick={startCasting} id="castButton">
          Start Casting
        </button> */}
        <button onClick={()=>navigate("/presentation")} id="stopCastBtn">
          Select Presentation
        </button>
      </footer>
    </div>
  );
}

export default MultipleAPPS;
