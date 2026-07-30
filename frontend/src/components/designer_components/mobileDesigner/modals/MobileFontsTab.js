import React from "react";
import FontsTab from "../../sidebar/FontsTab";

function MobileFontsTab({
  selectedDesign,
  setActiveTab,
  updateDesignsByView,
  activePreview,
  regionWidth,
  regionHeight,
  getBoundingBox,
  barRef
}) {
  return (
    <div
      className="mobile-crop-modal"
      style={{ paddingLeft: "15px", paddingRight: "15px" }}
      ref={barRef}
    >
      <div className="mobile-product-tabbar">
        <h2>{"Fonts"}</h2>

        <button
          className="close-btn"
          style={{ paddingTop: "0px", width: "25px", height: "25px" }}
          onClick={() => {
            setActiveTab("editText");
          }}
        >
          <i class="fa fa-times" style={{ fontSize: "25px" }}></i>
        </button>
      </div>
      <div className="mobile-crop-content">
        <FontsTab
          selectedDesign={selectedDesign}
          pendingText={selectedDesign.text}
          setActiveTab={setActiveTab}
          setDesignsByView={updateDesignsByView}
          activePreview={activePreview}
          regionWidth={regionWidth}
          regionHeight={regionHeight}
          getBoundingBox={getBoundingBox}
          isMobile={true}
        />
      </div>
    </div>
  );
}

export default MobileFontsTab;
