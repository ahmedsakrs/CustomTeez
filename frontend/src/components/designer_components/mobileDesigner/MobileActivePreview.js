import ActivePreview from "../mainArea/ActivePreview";

function MobileActivePreview({
  imgRef,
  productOptions,
  activeProduct,

  activePreview,

  designsByView,
  setDesignsByView,

  regionWidth,
  regionHeight,

  setRegionWidth,
  setRegionHeight,

  selectedDesignId,
  setSelectedDesignId,

  setActiveTab,

  isRotating,
  isResizing,

  setIsRotating,
  setIsResizing,

  setIsActive,

  setPendingText,

  getBoundingBox,

  updateDesignsByView,

  setJustFinishedInteraction,

  addDesignCollageToActiveView,

  ...rest
}) {
  return (
    <div className="mobile-preview-wrapper">
      <ActivePreview
        imgRef={imgRef}
        productOptions={productOptions}
        activeProduct={activeProduct}
        activePreview={activePreview}
        designsByView={designsByView}
        setDesignsByView={setDesignsByView}
        regionWidth={regionWidth}
        regionHeight={regionHeight}
        setRegionWidth={setRegionWidth}
        setRegionHeight={setRegionHeight}
        selectedDesignId={selectedDesignId}
        setSelectedDesignId={setSelectedDesignId}
        setActiveTab={setActiveTab}
        isRotating={isRotating}
        isResizing={isResizing}
        setIsRotating={setIsRotating}
        setIsResizing={setIsResizing}
        setIsActive={setIsActive}
        setPendingText={setPendingText}
        getBoundingBox={getBoundingBox}
        updateDesignsByView={updateDesignsByView}
        setJustFinishedInteraction={setJustFinishedInteraction}
        addDesignCollageToActiveView={addDesignCollageToActiveView}
        isMobile={true}
        {...rest}
      />
    </div>
  );
}

export default MobileActivePreview;
