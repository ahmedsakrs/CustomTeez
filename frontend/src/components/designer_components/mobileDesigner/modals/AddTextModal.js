import React from "react";
import TextArea from "../../sidebar/TextArea";

function AddTextModal({
  imgRef,
  updateDesignsByView,
  setSelectedDesignId,
  setActiveTab,
  getBoundingBox,
  activePreview,
  regionWidth,
  regionHeight,
  barRef,
  activeTab,
  designsByView,
  pendingText,
  setPendingText,
}) {
  return (
    <div className="mobile-text-sheet" ref={barRef}>
      <div className="mobile-product-tabbar">
        <h2>{activeTab === "addText" ? "Add Text" : "Edit Text"}</h2>

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
      <TextArea
        imgRef={imgRef}
        updateDesignsByView={updateDesignsByView}
        setSelectedDesignId={setSelectedDesignId}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        regionWidth={regionWidth}
        regionHeight={regionHeight}
        getBoundingBox={getBoundingBox}
        activePreview={activePreview}
        designsByView={designsByView}
        pendingText={pendingText}
        setPendingText={setPendingText}
        isMobile={true}
      />
    </div>
  );
}

export default AddTextModal;
