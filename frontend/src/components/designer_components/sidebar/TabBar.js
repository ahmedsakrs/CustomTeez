import React from "react";
import "./sidebar.css";

function TabBar({
  activeTab,
  setActiveTab,
  selectedCategory,
  setSelectedCategory,
  setSelectedDesignId,
  setIsCropping,
  barRef
}) {
  return (
    <div className="tab-bar"ref={barRef}>
      <button
        className="tab-bar-btn"
        onClick={(e) => {
          e.stopPropagation();
          if (activeTab === "addDesign") {
            if (selectedCategory) {
              setSelectedCategory(null);
            } else {
              setActiveTab(null);
            }
          } else if (activeTab === "Crop"){
            setActiveTab("editDesign");
            setIsCropping(false);
          }
          else if(activeTab === "editDesign" || activeTab === "editText"){
            setActiveTab(null);
            setSelectedDesignId(null);
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
          : activeTab === "Crop"
          ? "Crop"
          : activeTab === "editDesign"
          ? "Edit Design"
          : activeTab === "editText"
          ? "Edit Text"
          : ""
        }
      </span>
      {
        <button
          className="tab-bar-btn"
          onClick={() => {
            setActiveTab(null);
            setSelectedCategory(null);
            setIsCropping(false);
            setSelectedDesignId(null);
          }}
        >
          <i class="fa fa-times" style={{ fontSize: "17px" }}></i>
        </button>
      }
    </div>
  );
}

export default TabBar;
