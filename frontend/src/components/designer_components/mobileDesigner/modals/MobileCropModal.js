import React from "react";
import SideBarCropper from "../../sidebar/SideBarCropper";

function MobileCropModal({
  barRef,
  selectedDesign,
  applyCrop,
  setIsCropping,
  updateDesignsByView,
  activePreview,
  getBoundingBox,
  regionWidth,
  regionHeight,
  setActiveTab,
}) {
  return (
    <div className="mobile-crop-modal" style={{paddingLeft:"15px", paddingRight:"15px"}} ref={barRef}>
      <div className="mobile-product-tabbar">
        <h2>{"Crop"}</h2>

        <button
          className="close-btn"
          style={{ paddingTop: "0px", width: "25px", height: "25px" }}
          onClick={() => {
            setActiveTab(selectedDesign.type === "upload" ? "editUpload" : "editDesign");
          }}
        >
          <i class="fa fa-times" style={{ fontSize: "25px" }}></i>
        </button>
      </div>
      <div className="mobile-crop-content">
        <SideBarCropper
        design={selectedDesign}
        setIsCropping={setIsCropping}
        setDesignsByView={updateDesignsByView}
        activePreview={activePreview}
        getBoundingBox={getBoundingBox}
        regionWidth={regionWidth}
        regionHeight={regionHeight}
        setActiveTab={setActiveTab}
      />
      </div>
      
    </div>
  );
}

export default MobileCropModal;
