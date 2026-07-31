import React from "react";
import LineSpacer from "../../sidebar/LineSpacer";

function MobileLineSpacing({
  barRef,
  selectedDesign,
  setDesignsByView,
  updateDesignsByView,
  designsByView,
  activePreview,
  regionWidth,
  regionHeight,
  getBoundingBox,
  setActiveTab
}) {
  return (
    <div
      className="mobile-upload-sheet"
      style={{ height: "120px", maxHeight: "120px", minHeight: "120px" }}
      ref={barRef}
    >
      <div className="mobile-product-tabbar" style={{ marginBottom: "3px" }}>
        <h2>{"Line Spacing"}</h2>

        <button
          className="close-btn"
          style={{ paddingTop: "0px", width: "25px", height: "25px" }}
          onClick={() => {
            setActiveTab(
              selectedDesign?.text
                ? "editText"
                : selectedDesign?.type === "upload"
                  ? "editUpload"
                  : "editDesign",
            );
          }}
        >
          <i class="fa fa-times" style={{ fontSize: "25px" }}></i>
        </button>
      </div>
      <LineSpacer
        selectedDesign={selectedDesign}
        setDesignsByView={setDesignsByView}
        updateDesignsByView={updateDesignsByView}
        designsByView={designsByView}
        activePreview={activePreview}
        getBoundingBox={getBoundingBox}
        regionWidth={regionWidth}
        regionHeight={regionHeight}
        isMobile={true}
      />
    </div>
  );
}

export default MobileLineSpacing;
