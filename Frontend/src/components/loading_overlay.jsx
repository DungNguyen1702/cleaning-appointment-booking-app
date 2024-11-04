import React from "react";
import "./loading_overlay.scss";

const LoadingOverlay = ({ loading }) => {
  return (
    <div className={`loading-overlay ${loading ? "active" : ""}`}>
      <div className="loading-spinner"></div>
    </div>
  );
};

export default LoadingOverlay;
