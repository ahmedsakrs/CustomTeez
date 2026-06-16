import React from "react";
import "./sidebar.css";

function TabBar({
  activeTab,
  setActiveTab,
  selectedCategory,
  setSelectedCategory,
}) {
  return (
    <div className="tab-bar">
      <button
        className="tab-bar-btn"
        onClick={() => {
          if (activeTab === "addDesign") {
            if (selectedCategory) {
              setSelectedCategory(null);
            } else {
              setActiveTab(null);
            }
          } else {
          }
        }}
      >
        <i className="fas fa-angle-left" style={{ fontSize: "17px" }}>
          {" "}
        </i>
      </button>
      <span className="tab-title">
        {activeTab === "addDesign" && !selectedCategory
          ? "Design Categories"
          : activeTab === "addDesign" && selectedCategory
          ? selectedCategory
          : ""
        }
      </span>
      {
        <button
          className="tab-bar-btn"
          onClick={() => {
            setActiveTab(null);
            setSelectedCategory(null);
          }}
        >
          <i class="fa fa-times" style={{ fontSize: "17px" }}></i>
        </button>
      }
    </div>
  );
}

export default TabBar;
