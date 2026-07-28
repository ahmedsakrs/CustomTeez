import "./sidebar.css";
import React from "react";
import TabBar from "./TabBar";
import TabPanel from "./TabPanel";
import UndoRedoControls from "./UndoRedoControls";

function Sidebar({
  activeTab,
  setActiveTab,
  designCategories,
  panelRef,
  imgRef,
  barRef,
  designsByView,
  setDesignsByView,
  activePreview,
  selectedDesignId,
  setSelectedDesignId,
  getBoundingBox,
  regionWidth,
  regionHeight,
  isCropping,
  setIsCropping,
  isHeightZero,
  setIsHeightZero,
  isHeightBlank,
  setIsHeightBlank,
  isWidthZero,
  setIsWidthZero,
  isWidthBlank,
  setIsWidthBlank,
  pendingText,
  setPendingText,
  sideRef,
  updateDesignsByView,
  canUndo,
  canRedo,
  undo,
  redo,
  selectedCategory,
  setSelectedCategory,
}) {
  const selectedDesign = designsByView[activePreview].find(
    (d) => d.id === selectedDesignId,
  );
  if (activeTab === "productOptions")
    setActiveTab(null);

  if (
    activeTab === "productOptions" ||
    activeTab === "resize" ||
    activeTab === "rotate" ||
    activeTab === "layers" ||
    activeTab === "flip"
  )
    setActiveTab(selectedDesign.text ? "editText" : selectedDesign.type === "upload" ? "editUpload" : "editDesign");
  return (
    <div className="sidebar">
      <div className="sidebar-buttons" ref={sideRef}>
        <button
          className={`sidebar-btn ${activeTab === "addDesign" || activeTab === "editDesign" || activeTab === "Crop" ? "active" : ""}`}
          onClick={(e) => {
            // e.stopPropagation();
            setActiveTab("addDesign");
            setSelectedCategory(null);
            setSelectedDesignId(null);
          }}
        >
          <i className="bi bi-brush-fill" style={{ fontSize: "25px" }}></i>{" "}
          <br></br> Add Design
        </button>

        <button
          className={`sidebar-btn ${activeTab === "uploadDesign" || activeTab === "editUpload" ? "active" : ""}`}
          onClick={(e) => {
            // e.stopPropagation();
            setActiveTab("uploadDesign");
            setSelectedDesignId(null);
          }}
        >
          <i
            className="bi bi-cloud-upload-fill"
            style={{ fontSize: "30px" }}
          ></i>
          <br></br>Upload
        </button>

        <button
          className={`sidebar-btn ${activeTab === "addText" || activeTab === "editText" || activeTab === "changeFont" || activeTab === "changeShape" || activeTab === "changeFontColor" || activeTab === "changeFontOutline" ? "active" : ""}`}
          onClick={(e) => {
            // e.stopPropagation();
            setActiveTab("addText");
            setPendingText("");
            setSelectedDesignId(null);
          }}
        >
          <i className="fas fa-font" style={{ fontSize: "30px" }}></i>
          <br></br>Add Text
        </button>

        <button
          className={`sidebar-btn ${activeTab === "saveDesign" ? "active" : ""}`}
          onClick={(e) => {
            // e.stopPropagation();
            setActiveTab("saveDesign");
            setSelectedDesignId(null);
          }}
        >
          <i className="bi bi-floppy-fill" style={{ fontSize: "30px" }}></i>
          <br></br>Save Design
        </button>
      </div>
      <div className="sidebar-tab" ref={panelRef}>
        {activeTab && (
          <TabBar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            setSelectedDesignId={setSelectedDesignId}
            setIsCropping={setIsCropping}
            barRef={barRef}
          />
        )}
        <TabPanel
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          designCategories={designCategories}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          selectedDesignId={selectedDesignId}
          setSelectedDesignId={setSelectedDesignId}
          activePreview={activePreview}
          designsByView={designsByView}
          setDesignsByView={setDesignsByView}
          updateDesignsByView={updateDesignsByView}
          panelRef={panelRef}
          getBoundingBox={getBoundingBox}
          regionWidth={regionWidth}
          regionHeight={regionHeight}
          isCropping={isCropping}
          setIsCropping={setIsCropping}
          isHeightZero={isHeightZero}
          setIsHeightZero={setIsHeightZero}
          isHeightBlank={isHeightBlank}
          setIsHeightBlank={setIsHeightBlank}
          isWidthZero={isWidthZero}
          setIsWidthZero={setIsWidthZero}
          isWidthBlank={isWidthBlank}
          setIsWidthBlank={setIsWidthBlank}
          pendingText={pendingText}
          setPendingText={setPendingText}
          imgRef={imgRef}
        />

        <UndoRedoControls
          canUndo={canUndo}
          canRedo={canRedo}
          onUndo={undo}
          onRedo={redo}
        />
      </div>
    </div>
  );
}

export default Sidebar;
