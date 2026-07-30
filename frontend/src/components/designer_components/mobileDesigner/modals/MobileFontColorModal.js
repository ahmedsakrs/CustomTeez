import React from "react";
import FontColors from "../../sidebar/FontColors";

function MobileFontColorModal({
  selectedDesign,
  setActiveTab,
  updateDesignsByView,
  designsByView,
  activePreview,
  regionWidth,
  regionHeight,
  getBoundingBox,
  barRef
}) {
  return (
    <div className="mobile-text-sheet" ref={barRef}>
      <div className="mobile-product-tabbar">
        <h2>{"Font Color"}</h2>

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
        setDesignsByView={updateDesignsByView}
        updateDesignsByView={updateDesignsByView}
        designsByView={designsByView}
        activePreview={activePreview}
        regionWidth={regionWidth}
        regionHeight={regionHeight}
        getBoundingBox={getBoundingBox}
        isOutline={false}
        isMobile={true}
      />
    </div>
  );
}

export default MobileFontColorModal;
