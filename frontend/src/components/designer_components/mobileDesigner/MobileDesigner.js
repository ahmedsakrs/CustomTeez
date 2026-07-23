import React from "react";
import MobileActivePreview from "./MobileActivePreview";
import "./mobileDesigner.css";

function MobileDesigner({
  activeTab,
  setActiveTab,

  activePreview,
  setActivePreview,

  selectedDesignId,

  productOptions,
  activeProduct,

  imgRef,

  regionWidth,
  regionHeight,
  setRegionWidth,
  setRegionHeight,

  designsByView,
  setDesignsByView,

  isRotating,
  isResizing,

  setIsActive,
  setIsWidthBlank,
  setIsWidthZero,
  setIsHeightBlank,
  setIsHeightZero,

  setSelectedDesignId,
  setPendingText,
  pendingText,

  getBoundingBox,

  setJustFinishedInteraction,

  isActive,

  setIsRotating,
  setIsResizing,

  designCategories,

  panelRef,

  isCropping,
  setIsCropping,

  updateDesignsByView,

  allProducts,
  setAllProducts,
  activeProductId,
  setActiveProductId,

  contextMenu,
  setContextMenu,
}) {
  const hasSelection = !!selectedDesignId;

  return (
    <div className="mobile-designer">
      <MobileActivePreview
        imgRef={imgRef}
        productOptions={productOptions}
        regionWidth={regionWidth}
        regionHeight={regionHeight}
        setRegionWidth={setRegionWidth}
        setRegionHeight={setRegionHeight}
        activeProduct={activeProduct}
        designsByView={designsByView}
        setDesignsByView={setDesignsByView}
        activePreview={activePreview}
        isRotating={isRotating}
        isResizing={isResizing}
        setIsActive={setIsActive}
        setIsWidthBlank={setIsWidthBlank}
        setIsWidthZero={setIsWidthZero}
        setIsHeightBlank={setIsHeightBlank}
        setIsHeightZero={setIsHeightZero}
        setSelectedDesignId={setSelectedDesignId}
        setActiveTab={setActiveTab}
        setPendingText={setPendingText}
        getBoundingBox={getBoundingBox}
        setJustFinishedInteraction={setJustFinishedInteraction}
        isActive={isActive}
        selectedDesignId={selectedDesignId}
        setIsRotating={setIsRotating}
        setIsResizing={setIsResizing}
        updateDesignsByView={updateDesignsByView}
        contextMenu={contextMenu}
        setContextMenu={setContextMenu}
      />

      {!hasSelection && (
        <div className="mobile-bottom-nav">
          <button onClick={() => setActiveTab("productOptions")}>
            <i className="fas fa-tshirt" />
            <span>Product</span>
          </button>

          <button onClick={() => setActiveTab("addDesign")}>
            <i className="bi bi-brush-fill" />
            <span>Design</span>
          </button>

          <button onClick={() => setActiveTab("uploadDesign")}>
            <i className="bi bi-cloud-upload-fill" />
            <span>Upload</span>
          </button>

          <button onClick={() => setActiveTab("addText")}>
            <i className="fas fa-font" />
            <span>Text</span>
          </button>

          <button onClick={() => setActiveTab("saveDesign")}>
            <i className="bi bi-floppy-fill" />
            <span>Save</span>
          </button>
        </div>
      )}

      {hasSelection && (
        <div className="mobile-bottom-nav">
          <button onClick={() => setActiveTab("editDesign")}>
            <i className="bi bi-sliders" />
            <span>Edit</span>
          </button>

          <button onClick={() => setActiveTab("Crop")}>
            <i className="bi bi-crop" />
            <span>Crop</span>
          </button>

          <button onClick={() => setActiveTab("layers")}>
            <i className="bi bi-layers" />
            <span>Layer</span>
          </button>

          <button onClick={() => setActiveTab("selectionMenu")}>
            <i className="bi bi-three-dots" />
            <span>More</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default MobileDesigner;
