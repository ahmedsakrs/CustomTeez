import "./sidebar.css";
import React, { useState } from "react";
import TabBar from "./TabBar";
import TabPanel from "./TabPanel";
import UndoRedoControls from './UndoRedoControls';

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
}) {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [designCounter, setDesignCounter] = useState(0);

  const addDesignCollageToActiveView = (collage) => {
    if (!imgRef.current) return;

    const lastDesign = collage.designs[collage.designs.length - 1];

    const lastDesignId =
      lastDesign?.id ?? `design-${designCounter + collage.designs.length}`;

    setSelectedDesignId(lastDesignId);

    setDesignCounter((prev) => prev + collage.designs.length);

    setDesignsByView((prev) => {
      const designs = prev[activePreview] || [];
      const highest = designs.length
        ? Math.max(...designs.map((d) => d.layer || 1))
        : 0;
      return {
        ...prev,
        [activePreview]: [
          ...prev[activePreview],
          ...collage.designs.map((d, idx) => ({
            ...d,
            id: d.id ? d.id : `design-${designCounter + idx + 1}`,
            x: d.x,
            y: d.y,
            width: d.width, // already normalized in data
            height: d.height, // already normalized in data
            aspect_ratio: d.width / d.height,
            originalAspectRatio: d.width / d.height,
            isLocked_aspect_ratio: true,
            type: d.type,
            text: d.text,
            is_colorable: d.is_colorable,
            design_color: d.design_color,
            outline_width: d.design_outline,
            outline_color: d.outline_color,
            fontFamily: d.fontFamily,
            isBold: d.isBold || false,
            isItalic: d.isItalic || false,
            text_alignment: d.text_alignment,
            text_shape: d.text_shape,
            shape_intensity: d.shape_intensity,
            lineSpacing: d.lineSpacing,

            horizontalFlip: false,
            verticalFlip: false,
            rotation: 0,
            layer: highest + idx + 1,
            crop: { x: 0, y: 0, width: 1, height: 1 },
          })),
        ],
      };
    });
  };
  return (
    <div className="sidebar">
      <div className="sidebar-buttons" ref={sideRef}>
        <button
          className={`sidebar-btn ${activeTab === "addDesign" || activeTab === "editDesign" || activeTab === "Crop" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("addDesign");
            setSelectedCategory(null);
          }}
        >
          <i className="bi bi-brush-fill" style={{ fontSize: "25px" }}></i>{" "}
          <br></br> Add Design
        </button>

        <button
          className={`sidebar-btn ${activeTab === "uploadDesign" || activeTab === "editUpload" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("uploadDesign");
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
          onClick={() => {
            setActiveTab("addText");
            setPendingText("");
          }}
        >
          <i className="fas fa-font" style={{ fontSize: "30px" }}></i>
          <br></br>Add Text
        </button>

        <button
          className={`sidebar-btn ${activeTab === "saveDesign" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("saveDesign");
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
          addDesignCollageToActiveView={addDesignCollageToActiveView}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          selectedDesignId={selectedDesignId}
          setSelectedDesignId={setSelectedDesignId}
          activePreview={activePreview}
          designsByView={designsByView}
          setDesignsByView={setDesignsByView}
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
