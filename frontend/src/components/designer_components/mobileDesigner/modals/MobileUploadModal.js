import React from "react";
import UploaderTab from "../../sidebar/UploaderTab";

function MobileUploadModal({
  imgRef,
  updateDesignsByView,
  setSelectedDesignId,
  setActiveTab,
  getBoundingBox,
  activePreview,
  regionWidth,
  regionHeight,
  barRef,
}) {
  return (
    <div className="mobile-upload-sheet" ref={barRef}>
      <div className="mobile-product-tabbar">
        <h2>{"Upload Design"}</h2>

        <button
          className="close-btn"
          style={{ paddingTop: "0px", width: "25px", height: "25px" }}
          onClick={() => {
            setActiveTab(null);
          }}
        >
          <i class="fa fa-times" style={{ fontSize: "25px" }}></i>
        </button>
      </div>
      <UploaderTab
        imgRef={imgRef}
        updateDesignsByView={updateDesignsByView}
        setSelectedDesignId={setSelectedDesignId}
        setActiveTab={setActiveTab}
        getBoundingBox={getBoundingBox}
        activePreview={activePreview}
        regionWidth={regionWidth}
        regionHeight={regionHeight}
        isMobile={true}
      />
    </div>
  );
}

export default MobileUploadModal;
