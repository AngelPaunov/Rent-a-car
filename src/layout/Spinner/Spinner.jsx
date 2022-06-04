import React from "react";
import "./Spinner.css";

export default function Spinner() {
  return (
    <div className="lds-container">
      <div className="lds-dual-ring"></div>
    </div>
  );
}
