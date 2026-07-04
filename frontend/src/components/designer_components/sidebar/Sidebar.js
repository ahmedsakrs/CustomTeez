import "./sidebar.css";
import React, { useState } from "react";
import TabBar from "./TabBar";
import TabPanel from "./TabPanel";

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
}) {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [designCounter, setDesignCounter] = useState(0);

  const addDesignCollageToActiveView = (collage) => {
    if (!imgRef.current) return;

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
            isBold: false,
            isItalic: false,
            text_alignment: d.text_alignment,
            text_shape: d.text_shape,
            shape_intensity: d.shape_intensity,

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
      <div className="sidebar-buttons">
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
          className={`sidebar-btn ${activeTab === "uploadDesign" ? "active" : ""}`}
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

        {/* {activeTab === "default" && (
          <>
            <h3>Designs</h3>
            <h3>Upload Design</h3>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (ev) => {
                    const img = new Image();
                    img.onload = () => {
                      const aspectRatio = img.width / img.height;

                      // pick a base normalized width
                      const baseWidth = 0.2;
                      const baseHeight = baseWidth / aspectRatio;

                      addDesignCollageToActiveView({
                        id: `upload-${Date.now()}`,
                        name: file.name,
                        designs: [
                          {
                            id: `element-${Date.now()}`,
                            src: ev.target.result,
                            x: 0.25,
                            y: 0.25,
                            width: baseWidth,
                            height: baseHeight, // ✅ preserves aspect ratio
                          },
                        ],
                      });
                    };
                    img.src = ev.target.result;
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />

            <h3>Add Text</h3>
            <button
              onClick={(e) => {
                e.stopPropagation();
                // setActivePanelTab("addText");
                setTextAdded(false);
              }}
            >
              📝 Add Text
            </button>
          </>
        )} */}

        {/* {activeTab === "editDesign" && (
          <>
            <h3>Edit Design</h3>
            <div ref={panelRef} className="edit-panel">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                //   flipSelected("horizontal");
                }}
              >
                Flip Horizontal
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                //   flipSelected("vertical");
                }}
              >
                Flip Vertical
              </button> */}
        {/* <input
                type="color"
                value={designColor}
                onChange={(e) => {
                  e.stopPropagation();
                  setDesignColor(e.target.value);
                }}
              />
              <button
                onClick={() => {
                  setActivePanelTab("default");
                  setSelectedDesignId(null);
                }}
              >
                ⬅ Back
              </button> */}
        {/* </div>
          </>
        )} */}

        {/* {activePanelTab === "addText" && (
          <>
            <h3>Add Text</h3>
            <div ref={textPanelRef} className="text-panel">
              <textarea
                placeholder="Type your text here..."
                rows={1}
                style={{ width: "100%", padding: "0.5rem" }}
                value={pendingText}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => setPendingText(e.target.value)}
              />

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (pendingText.trim() !== "") {
                    const maxFontSizePx = findFittingFontSize(
                      pendingText,
                      regionWidth,
                      "Arial",
                    );
                    const imageData = textToImage(
                      pendingText,
                      maxFontSizePx,
                      "Arial",
                      1,
                      "black",
                    );
                    const id = `text-${Date.now()}`;

                    addDesignCollageToActiveView({
                      id: id,
                      name: "Text Image",
                      designs: [
                        {
                          id: `element-${Date.now()}`,
                          src: imageData.img, // ✅ high-res image
                          text: pendingText,
                          x: 0,
                          y: 0,
                          width: 0.5, // normalized to full region
                          height: (imageData.height * 0.5) / imageData.width,
                          rotation: 0,
                          fontFamily: "Arial",
                          color: "black",
                          lineSpacing: 1,
                        },
                      ],
                    });

                    setPendingText("");
                    setSelectedDesignId(id);
                    setTextAdded(true);
                    setActivePanelTab("addText");
                  }
                }}
              >
                ➕ Add Text
              </button> */}

        {/* ✅ Only show options if textAdded is true */}
        {/* {textAdded && (
                <>
                  <h4>Text Options</h4>
                  <input
                    type="color"
                    value={designColor}
                    onChange={(e) => setDesignColor(e.target.value)}
                  />
                  <button onClick={() => centerSelectedText()}>
                    Center Text
                  </button>
                  <button onClick={() => toggleOutlineSelectedText()}>
                    Toggle Outline
                  </button>
                </>
              )}

              <button
                onClick={() => {
                  setActivePanelTab("default");
                  setSelectedDesignId(null);
                }}
              >
                ⬅ Back
              </button>
            </div>
          </>
        )} */}
      </div>
    </div>
  );
}

export default Sidebar;
