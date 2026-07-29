import React from "react";
import MobileActivePreview from "./MobileActivePreview";
import "./mobileDesigner.css";
import MobileProductModal from "./modals/MobileProductModal";
import DesignsModal from "./modals/DesignsModal";
import MobileUploadModal from "./modals/MobileUploadModal";
import AddTextModal from "./modals/AddTextModal";
import { center, duplicateDesign } from "../../../utils/designerUtils";
import MobileCropModal from "./modals/MobileCropModal";
import MobileFlipModal from "./modals/MobileFlipModal";
import MobileOrderModal from "./modals/MobileOrderModal";
import MobileRotationModal from "./modals/MobileRotationModal";
import MobileResizeModal from "./modals/MobileResizeModal";

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

  setShowProductModal,
  setShowColorModal,

  barRef,
  setIsAddingProduct,
  selectedCategory,
  setSelectedCategory,

  sideRef,
}) {
  const selectedDesign = designsByView[activePreview].find(
    (d) => d.id === selectedDesignId,
  );
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
      {activeTab === "productOptions" && (
        <MobileProductModal
          setActiveTab={setActiveTab}
          allProducts={allProducts}
          setAllProducts={setAllProducts}
          activeProductId={activeProductId}
          setActiveProductId={setActiveProductId}
          activeProduct={activeProduct}
          productOptions={productOptions}
          setShowProductModal={setShowProductModal}
          setShowColorModal={setShowColorModal}
          barRef={barRef}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
      )}
      {activeTab === "addDesign" && (
        <DesignsModal
          barRef={barRef}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          designCategories={designCategories}
          setActiveTab={setActiveTab}
          setSelectedDesignId={setSelectedDesignId}
          imgRef={imgRef}
          updateDesignsByView={updateDesignsByView}
          activePreview={activePreview}
        />
      )}
      {activeTab === "addText" && (
        <AddTextModal
          imgRef={imgRef}
          updateDesignsByView={updateDesignsByView}
          setSelectedDesignId={setSelectedDesignId}
          setActiveTab={setActiveTab}
          getBoundingBox={getBoundingBox}
          activePreview={activePreview}
          regionWidth={regionWidth}
          regionHeight={regionHeight}
          barRef={barRef}
          activeTab={activeTab}
          designsByView={designsByView}
          pendingText={pendingText}
          setPendingText={setPendingText}
        />
      )}
      {activeTab === "uploadDesign" && (
        <MobileUploadModal
          setActiveTab={setActiveTab}
          imgRef={imgRef}
          updateDesignsByView={updateDesignsByView}
          setSelectedDesignId={setSelectedDesignId}
          getBoundingBox={getBoundingBox}
          activePreview={activePreview}
          regionWidth={regionWidth}
          regionHeight={regionHeight}
          barRef={barRef}
        />
      )}
      {activeTab === "Crop" && (
        <MobileCropModal
          barRef={barRef}
          selectedDesign={selectedDesign}
          setIsCropping={setIsCropping}
          updateDesignsByView={updateDesignsByView}
          activePreview={activePreview}
          getBoundingBox={getBoundingBox}
          regionWidth={regionWidth}
          regionHeight={regionHeight}
          setActiveTab={setActiveTab}
        />
      )}
      {activeTab === "flip" && (
        <MobileFlipModal
          barRef={barRef}
          selectedDesign={selectedDesign}
          setActiveTab={setActiveTab}
          activePreview={activePreview}
          setDesignsByView={updateDesignsByView}
        />
      )}
      {activeTab === "layers" && (
        <MobileOrderModal
          barRef={barRef}
          selectedDesign={selectedDesign}
          setActiveTab={setActiveTab}
          activePreview={activePreview}
          setDesignsByView={updateDesignsByView}
          designsByView={designsByView}
        />
      )}
      {activeTab === "rotate" && (
        <MobileRotationModal
          barRef={barRef}
          selectedDesign={selectedDesign}
          designsByView={designsByView}
          setDesignsByView={setDesignsByView}
          updateDesignsByView={updateDesignsByView}
          activePreview={activePreview}
          getBoundingBox={getBoundingBox}
          regionWidth={regionWidth}
          regionHeight={regionHeight}
          setActiveTab={setActiveTab}
        />
      )}
      {activeTab === "resize" && (
        <MobileResizeModal
          selectedDesign={selectedDesign}
          regionWidth={regionWidth}
          regionHeight={regionHeight}
          setIsHeightBlank={setIsHeightBlank}
          setIsWidthBlank={setIsWidthBlank}
          setIsHeightZero={setIsHeightZero}
          setIsWidthZero={setIsWidthZero}
          setDesignsByView={updateDesignsByView}
          activePreview={activePreview}
          getBoundingBox={getBoundingBox}
          setActiveTab={setActiveTab}
          barRef={barRef}
        />
      )}
      {!selectedDesign && (
        <div className="mobile-bottom-nav" ref={sideRef}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setActiveTab("productOptions");
            }}
          >
            <i className="fas fa-tshirt" />
            <span>Product</span>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setActiveTab("addDesign");
              setSelectedCategory(null);
            }}
          >
            <i className="bi bi-brush-fill" />
            <span>Design</span>
          </button>

          <button onClick={() => setActiveTab("uploadDesign")}>
            <i className="bi bi-cloud-upload-fill" />
            <span>Upload</span>
          </button>

          <button
            onClick={() => {
              setPendingText("");
              setActiveTab("addText");
            }}
          >
            <i className="fas fa-font" />
            <span>Text</span>
          </button>

          <button onClick={() => setActiveTab("saveDesign")}>
            <i className="bi bi-floppy-fill" />
            <span>Save</span>
          </button>
        </div>
      )}
      {selectedDesign && (
        <div>
          {!selectedDesign?.text && (
            <div className="mobile-bottom-nav" ref={sideRef}>
              <button onClick={() => setActiveTab("resize")}>
                <i className="bi bi-pip" style={{ fontSize: "33px" }}></i>
                <span>Resize</span>
              </button>

              <button onClick={() => setActiveTab("rotate")}>
                <i
                  className="bi bi-arrow-repeat"
                  style={{ fontSize: "33px" }}
                ></i>
                <span>Rotate</span>
              </button>

              <button onClick={() => setActiveTab("layers")}>
                <i className="bi bi-stack" />
                <span>Order</span>
              </button>

              <button onClick={() => setActiveTab("flip")}>
                <i className="bi bi-symmetry-vertical"></i>
                <span>Flip</span>
              </button>

              <button
                onClick={() =>
                  duplicateDesign(
                    selectedDesignId,
                    activePreview,
                    updateDesignsByView,
                    regionWidth,
                    regionHeight,
                    setSelectedDesignId,
                    getBoundingBox,
                  )
                }
              >
                <i class="bi bi-copy"></i>
                <span>Duplicate</span>
              </button>

              <button onClick={() => setActiveTab("Crop")}>
                <i class="bi bi-crop"></i>
                <span>Crop</span>
              </button>

              <button
                onClick={() =>
                  center(
                    selectedDesignId,
                    updateDesignsByView,
                    activePreview,
                    getBoundingBox,
                    regionWidth,
                    regionHeight,
                  )
                }
              >
                <i class="bi bi-arrows-collapse-vertical"></i>
                <span>Center</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default MobileDesigner;
