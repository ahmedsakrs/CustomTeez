import React from "react";
import FontColors from "../../sidebar/FontColors";

function MobileOutlineModal({
  selectedDesign,
  setActiveTab,
  updateDesignsByView,
  setDesignsByView,
  designsByView,
  activePreview,
  regionWidth,
  regionHeight,
  getBoundingBox,
  barRef,
}) {
  return (
    <div className="mobile-text-sheet" ref={barRef}>
      <div className="mobile-product-tabbar">
        <h2>{"Outline Color"}</h2>

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

      <FontColors
        selectedDesign={selectedDesign}
        pendingText={selectedDesign.text}
        setActiveTab={setActiveTab}
        setDesignsByView={setDesignsByView}
        updateDesignsByView={updateDesignsByView}
        designsByView={designsByView}
        activePreview={activePreview}
        regionWidth={regionWidth}
        regionHeight={regionHeight}
        getBoundingBox={getBoundingBox}
        isOutline={true}
        isMobile={true}
      />
    </div>
  );
}

export default MobileOutlineModal;
