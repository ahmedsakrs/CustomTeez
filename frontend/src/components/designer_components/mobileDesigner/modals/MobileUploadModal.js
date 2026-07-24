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
    <div className="mobile-designs-modal" ref={barRef}>
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
