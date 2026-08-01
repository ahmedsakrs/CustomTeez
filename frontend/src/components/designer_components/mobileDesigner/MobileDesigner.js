import React, { useState, useEffect, useCallback } from "react";
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
import MobileFontsTab from "./modals/MobileFontsTab";
import MobileFontColorModal from "./modals/MobileFontColorModal";
import outlineIcon from "./modals/text-outline-icon.svg";
import shapeIcon from "./modals/text-shape-icon.svg";
import MobileOutlineModal from "./modals/MobileOutlineModal";
import MobileLineSpacing from "./modals/MobileLineSpacing";
import MobileTextShapeModal from "./modals/MobileTextShapeModal";
import MobileStyleModal from "./modals/MobileStyleModal";
import MobileAlignmentModal from "./modals/MobileAlignmentModal";

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

  canUndo,
  canRedo,
  undo,
  redo,

  showViewsPanel,
  setShowViewsPanel,

  viewsRef,
}) {
  const selectedDesign = designsByView[activePreview].find(
    (d) => d.id === selectedDesignId,
  );

  const [showLeftFade, setShowLeftFade] = useState(false);
  const [showRightFade, setShowRightFade] = useState(false);

  const updateFades = useCallback(() => {
    const el = sideRef.current;

    if (!el) return;

    setShowLeftFade(el.scrollLeft > 0);

    setShowRightFade(el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
  }, [sideRef, setShowLeftFade, setShowRightFade]);

  useEffect(() => {
    updateFades();

    window.addEventListener("resize", updateFades);

    return () => window.removeEventListener("resize", updateFades);
  }, [selectedDesign, updateFades]);

  useEffect(() => {
    setShowViewsPanel(false);
  }, [activePreview, setShowViewsPanel]);

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
      <div className="mobile-history-buttons">
        <button
          className="mobile-floating-btn"
          onClick={undo}
          disabled={!canUndo}
        >
          <i className="bi bi-arrow-counterclockwise" />
        </button>

        <button
          className="mobile-floating-btn"
          onClick={redo}
          disabled={!canRedo}
        >
          <i className="bi bi-arrow-clockwise" />
        </button>
      </div>

      <div className="mobile-views-dropdown" ref={viewsRef}>
        <button
          className="mobile-floating-btn"
          onClick={() => setShowViewsPanel((prev) => !prev)}
        >
          <i className="bi bi-arrow-repeat"></i>
        </button>

        {showViewsPanel && (
          <div className="mobile-views-panel">
            <button
              className={activePreview === "Front" ? "active" : ""}
              onClick={() => {
                setActivePreview("Front");
                setShowViewsPanel(false);
              }}
            >
              Front
            </button>

            <button
              className={activePreview === "Back" ? "active" : ""}
              onClick={() => {
                setActivePreview("Back");
                setShowViewsPanel(false);
              }}
            >
              Back
            </button>

            <button
              className={activePreview === "Left Sleeve" ? "active" : ""}
              onClick={() => {
                setActivePreview("L Sleeve");
                setShowViewsPanel(false);
              }}
            >
              L Sleeve
            </button>

            <button
              className={activePreview === "Right Sleeve" ? "active" : ""}
              onClick={() => {
                setActivePreview("R Sleeve");
                setShowViewsPanel(false);
              }}
            >
              R Sleeve
            </button>
          </div>
        )}
      </div>

      <div
        className={`mobile-bottom-nav-wrapper ${showLeftFade ? "show-left-fade" : ""} ${showRightFade ? "show-right-fade" : ""}`}
      >
        <button
          className="mobile-next-btn"
          // onClick={() => navigate("/next-screen")}
        >
          <i className="bi bi-arrow-right" />
        </button>
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
        {activeTab === "editTextArea" && (
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
            selectedDesign={selectedDesign}
          />
        )}
        {activeTab === "changeFont" && (
          <MobileFontsTab
            selectedDesign={selectedDesign}
            pendingText={selectedDesign.text}
            setActiveTab={setActiveTab}
            setDesignsByView={updateDesignsByView}
            activePreview={activePreview}
            regionWidth={regionWidth}
            regionHeight={regionHeight}
            getBoundingBox={getBoundingBox}
            barRef={barRef}
          />
        )}
        {activeTab === "changeFontColor" && (
          <MobileFontColorModal
            selectedDesign={selectedDesign}
            setActiveTab={setActiveTab}
            updateDesignsByView={updateDesignsByView}
            designsByView={designsByView}
            activePreview={activePreview}
            regionWidth={regionWidth}
            regionHeight={regionHeight}
            getBoundingBox={getBoundingBox}
            barRef={barRef}
          />
        )}
        {activeTab === "changeFontOutline" && (
          <MobileOutlineModal
            selectedDesign={selectedDesign}
            setActiveTab={setActiveTab}
            setDesignsByView={setDesignsByView}
            updateDesignsByView={updateDesignsByView}
            designsByView={designsByView}
            activePreview={activePreview}
            regionWidth={regionWidth}
            regionHeight={regionHeight}
            getBoundingBox={getBoundingBox}
            barRef={barRef}
          />
        )}
        {activeTab === "changeLineSpacing" && (
          <MobileLineSpacing
            barRef={barRef}
            selectedDesign={selectedDesign}
            setDesignsByView={setDesignsByView}
            updateDesignsByView={updateDesignsByView}
            designsByView={designsByView}
            activePreview={activePreview}
            regionWidth={regionWidth}
            regionHeight={regionHeight}
            getBoundingBox={getBoundingBox}
            setActiveTab={setActiveTab}
          />
        )}
        {activeTab === "changeShape" && (
          <MobileTextShapeModal
            barRef={barRef}
            selectedDesign={selectedDesign}
            setActiveTab={setActiveTab}
            setDesignsByView={setDesignsByView}
            updateDesignsByView={updateDesignsByView}
            designsByView={designsByView}
            activePreview={activePreview}
            regionWidth={regionWidth}
            regionHeight={regionHeight}
            getBoundingBox={getBoundingBox}
          />
        )}
        {activeTab === "style" && (
          <MobileStyleModal
            barRef={barRef}
            selectedDesign={selectedDesign}
            setDesignsByView={updateDesignsByView}
            activePreview={activePreview}
            regionWidth={regionWidth}
            regionHeight={regionHeight}
            getBoundingBox={getBoundingBox}
            setActiveTab={setActiveTab}
          />
        )}
        {activeTab === "alignment" && (
          <MobileAlignmentModal
            barRef={barRef}
            selectedDesign={selectedDesign}
            setDesignsByView={updateDesignsByView}
            activePreview={activePreview}
            regionWidth={regionWidth}
            regionHeight={regionHeight}
            getBoundingBox={getBoundingBox}
            setActiveTab={setActiveTab}
          />
        )}
        {!selectedDesign && (
          <div
            className="mobile-bottom-nav"
            onScroll={updateFades}
            ref={sideRef}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowViewsPanel(false);
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
                setShowViewsPanel(false);
                setSelectedCategory(null);
              }}
            >
              <i className="bi bi-brush-fill" />
              <span>Design</span>
            </button>

            <button
              onClick={() => {
                setActiveTab("uploadDesign");
                setShowViewsPanel(false);
              }}
            >
              <i className="bi bi-cloud-upload-fill" />
              <span>Upload</span>
            </button>

            <button
              onClick={() => {
                setPendingText("");
                setShowViewsPanel(false);
                setActiveTab("addText");
              }}
            >
              <i className="fas fa-font" />
              <span>Text</span>
            </button>

            <button
              onClick={() => {
                setActiveTab("saveDesign");
                setShowViewsPanel(false);
              }}
            >
              <i className="bi bi-floppy-fill" />
              <span>Save</span>
            </button>
          </div>
        )}
        {selectedDesign && (
          <div>
            {!selectedDesign?.text && (
              <div
                className="mobile-bottom-nav"
                onScroll={updateFades}
                ref={sideRef}
              >
                <button
                  onClick={() => {
                    setActiveTab("resize");
                    setShowViewsPanel(false);
                  }}
                >
                  <i className="bi bi-pip"
                  //  style={{ fontSize: "33px" }}
                   ></i>
                  <span>Resize</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab("rotate");
                    setShowViewsPanel(false);
                  }}
                >
                  <i
                    className="bi bi-arrow-repeat"
                    // style={{ fontSize: "33px" }}
                  ></i>
                  <span>Rotate</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab("layers");
                    setShowViewsPanel(false);
                  }}
                >
                  <i className="bi bi-stack" />
                  <span>Order</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab("flip");
                    setShowViewsPanel(false);
                  }}
                >
                  <i className="bi bi-symmetry-vertical"></i>
                  <span>Flip</span>
                </button>

                <button
                  onClick={() => {
                    duplicateDesign(
                      selectedDesignId,
                      activePreview,
                      updateDesignsByView,
                      regionWidth,
                      regionHeight,
                      setSelectedDesignId,
                      getBoundingBox,
                    );
                    setShowViewsPanel(false);
                  }}
                >
                  <i class="bi bi-copy"></i>
                  <span>Duplicate</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab("Crop");
                    setShowViewsPanel(false);
                  }}
                >
                  <i class="bi bi-crop"></i>
                  <span>Crop</span>
                </button>

                <button
                  onClick={() => {
                    setShowViewsPanel(false);
                    center(
                      selectedDesignId,
                      updateDesignsByView,
                      activePreview,
                      getBoundingBox,
                      regionWidth,
                      regionHeight,
                    );
                  }}
                >
                  <i class="bi bi-arrows-collapse-vertical"></i>
                  <span>Center</span>
                </button>
              </div>
            )}

            {selectedDesign?.text && (
              <div
                className="mobile-bottom-nav"
                onScroll={updateFades}
                ref={sideRef}
              >
                <button
                  onClick={() => {
                    setActiveTab("editTextArea");
                    setShowViewsPanel(false);
                  }}
                >
                  <i
                    className="bi bi-pen-fill"
                    // style={{ fontWeight: "bold", fontSize: "33px" }}
                  ></i>
                  <span>Edit Text</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab("changeFont");
                    setShowViewsPanel(false);
                  }}
                >
                  <i
                    className="bi bi-fonts"
                    style={{
                      fontSize: "40px",
                    }}
                  ></i>
                  <span>Fonts</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab("changeFontColor");
                    setShowViewsPanel(false);
                  }}
                >
                  <i
                    className="bi bi-palette-fill"
                    // style={{ fontWeight: "bold", fontSize: "33px" }}
                  ></i>
                  <span>Change Color</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab("changeFontOutline");
                    setShowViewsPanel(false);
                  }}
                >
                  <img
                    src={outlineIcon}
                    alt=""
                    // style={{
                    //   width: "40px",
                    //   height: "40px",
                    //   paddingBottom: "7px",
                    // }}
                  />
                  <span>Outline</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab("changeShape");
                    setShowViewsPanel(false);
                  }}
                >
                  <img
                    src={shapeIcon}
                    alt=""
                    style={{
                      width: "65px",
                      // height: "35px",
                    }}
                  />
                  <span>Shape</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab("style");
                    setShowViewsPanel(false);
                  }}
                >
                  <i
                    className="bi bi-type-bold"
                    // style={{ fontWeight: "bold", fontSize: "33px" }}
                  ></i>
                  <span>Style</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab("alignment");
                    setShowViewsPanel(false);
                  }}
                  disabled={selectedDesign?.text_shape !== "normal"}
                >
                  <i
                    className={
                      selectedDesign?.text_alignment === "left"
                        ? "bi bi-text-left"
                        : selectedDesign?.text_alignment === "center"
                          ? "bi bi-text-center"
                          : "bi bi-text-right"
                    }
                    // style={{ fontWeight: "bold", fontSize: "33px" }}
                  ></i>
                  <span>Alignment</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab("changeLineSpacing");
                    setShowViewsPanel(false);
                  }}
                >
                  <i
                    className="bi bi-arrows-vertical"
                    // style={{ fontWeight: "bold", fontSize: "33px" }}
                  ></i>
                  <span>Spacing</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab("resize");
                    setShowViewsPanel(false);
                  }}
                >
                  <i className="bi bi-pip"
                  //  style={{ fontSize: "33px" }}
                   ></i>
                  <span>Resize</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab("rotate");
                    setShowViewsPanel(false);
                  }}
                >
                  <i
                    className="bi bi-arrow-repeat"
                    // style={{ fontSize: "33px" }}
                  ></i>
                  <span>Rotate</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab("layers");
                    setShowViewsPanel(false);
                  }}
                >
                  <i className="bi bi-stack" />
                  <span>Order</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab("flip");
                    setShowViewsPanel(false);
                  }}
                >
                  <i className="bi bi-symmetry-vertical"></i>
                  <span>Flip</span>
                </button>

                <button
                  onClick={() => {
                    setShowViewsPanel(false);
                    duplicateDesign(
                      selectedDesignId,
                      activePreview,
                      updateDesignsByView,
                      regionWidth,
                      regionHeight,
                      setSelectedDesignId,
                      getBoundingBox,
                    );
                  }}
                >
                  <i class="bi bi-copy"></i>
                  <span>Duplicate</span>
                </button>

                <button
                  onClick={() => {
                    center(
                      selectedDesignId,
                      updateDesignsByView,
                      activePreview,
                      getBoundingBox,
                      regionWidth,
                      regionHeight,
                    );
                    setShowViewsPanel(false);
                  }}
                >
                  <i class="bi bi-arrows-collapse-vertical"></i>
                  <span>Center</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default MobileDesigner;
