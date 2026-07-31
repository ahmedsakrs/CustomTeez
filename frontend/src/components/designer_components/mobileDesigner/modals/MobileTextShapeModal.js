import React from "react";
import FontShapeTab from "../../sidebar/FontShapeTab";

function MobileTextShapeModal({
  barRef,
  selectedDesign,
  setActiveTab,
  setDesignsByView,
  designsByView,
  updateDesignsByView,
  activePreview,
  regionWidth,
  regionHeight,
  getBoundingBox,
}) {
  return (
    <div className="mobile-text-sheet" ref={barRef}>
      <div className="mobile-product-tabbar">
        <h2>{"Text Shape"}</h2>

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

      <FontShapeTab
        selectedDesign={selectedDesign}
        pendingText={selectedDesign.text}
        setActiveTab={setActiveTab}
        setDesignsByView={setDesignsByView}
        designsByView={designsByView}
        updateDesignsByView={updateDesignsByView}
        activePreview={activePreview}
        regionWidth={regionWidth}
        regionHeight={regionHeight}
        getBoundingBox={getBoundingBox}
        isMobile={true}
      />
    </div>
  );
}

export default MobileTextShapeModal;
