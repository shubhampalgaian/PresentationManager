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
  console.log("column in multiple app: ", id, name, tvs);
  
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
      <div className="btns"><button>Let's cast it yeay!</button></div>
    </div>
  );
}

export default MultipleAPPS;
