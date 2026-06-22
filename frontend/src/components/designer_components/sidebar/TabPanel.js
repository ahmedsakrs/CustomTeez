import React, { useState } from "react";
import { Row, Col } from "react-bootstrap";
import CategoryThumb from "./CategoryThumb";
import DesignThumb from "./DesignThumb";
// import Cropper from "react-easy-crop";
import SideBarCropper from './SideBarCropper'
import {
  sendToBack,
  bringToFront,
  flipHorizontal,
  flipVertical,
  duplicateDesign,
  radToDeg,
  rotate,
  updateSize,
  handleToggleAspectLock,
  checkAfterRotation,
  applyCrop
} from "../../../utils/designerUtils";

function TabPanel({
  selectedCategory,
  setSelectedCategory,
  designCategories,
  addDesignCollageToActiveView,
  activeTab,
  setActiveTab,
  selectedDesignId,
  setSelectedDesignId,
  activePreview,
  designsByView,
  setDesignsByView,
  panelRef,
  getBoundingBox,
  regionWidth,
  regionHeight,
}) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isCropping, setIsCropping] = useState(false);

  const currentDesigns = designsByView[activePreview] || [];
  const highestZ = Math.max(...currentDesigns.map((d) => d.layer || 1));
  const lowestZ = Math.min(...currentDesigns.map((d) => d.layer || 0));
  const selectedDesign = designsByView[activePreview].find(
    (d) => d.id === selectedDesignId,
  );
  return (
    <div className="tab-content" ref={panelRef}>
      {!selectedCategory && activeTab === "addDesign" && (
        <>
          <Row xl={2}>
            {Object.keys(designCategories).map((cat) => (
              <Col key={cat.id}>
                {" "}
                <CategoryThumb
                  cat={cat}
                  setSelectedCategory={setSelectedCategory}
                />
              </Col>
            ))}
          </Row>
        </>
      )}

      {selectedCategory && activeTab === "addDesign" && (
        <>
          <div className="design-grid">
            {designCategories[selectedCategory].map((d) => (
              <DesignThumb
                d={d}
                addDesignCollageToActiveView={addDesignCollageToActiveView}
                setActiveTab={setActiveTab}
              />
            ))}
          </div>
        </>
      )}

      {selectedDesignId && selectedDesign && !isCropping &&(
        <>
          {activeTab === "editDesign" && selectedDesignId && (
            <div className="tab-content">
              {/* 1. Layer order */}
              <div className="edit-row">
                <button
                  disabled={selectedDesign?.layer === highestZ}
                  onClick={(e) => {
                    e.stopPropagation();
                    bringToFront(
                      activePreview,
                      selectedDesignId,
                      setDesignsByView,
                    );
                  }}
                >
                  <i class="bi bi-front"></i>
                </button>
                <button
                  disabled={selectedDesign?.layer === lowestZ}
                  onClick={(e) => {
                    e.stopPropagation();
                    sendToBack(
                      activePreview,
                      selectedDesignId,
                      setDesignsByView,
                    );
                  }}
                >
                  <i class="bi bi-back"></i>
                </button>
              </div>

              {/* 2. Crop */}
              <div className="edit-row">
                <button onClick={() => setIsCropping(true)}>
                  Crop
                </button>
              </div>

              {/* 3. Flip */}
              <div className="edit-row">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    flipHorizontal(
                      activePreview,
                      selectedDesignId,
                      setDesignsByView,
                    );
                  }}
                >
                  <i class="bi bi-symmetry-vertical"></i>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    flipVertical(
                      activePreview,
                      selectedDesignId,
                      setDesignsByView,
                    );
                  }}
                >
                  <i class="bi bi-symmetry-horizontal"></i>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    duplicateDesign(
                      selectedDesignId,
                      activePreview,
                      setDesignsByView,
                      regionWidth,
                      regionHeight,
                      setSelectedDesignId,
                    );
                  }}
                >
                  <i class="fa-solid fa-clone"></i>
                </button>
              </div>

              {/* 4. Rotate */}
              <div className="edit-row">
                <label>Rotate:</label>
                <input
                  type="range"
                  min="-180"
                  max="180"
                  step={1}
                  value={Math.floor(radToDeg(selectedDesign?.rotation))}
                  onChange={(e) =>
                    rotate(
                      selectedDesign,
                      setDesignsByView,
                      activePreview,
                      (parseInt(e.target.value) * Math.PI) / 180,
                      getBoundingBox,
                      regionWidth,
                      regionHeight,
                    )
                  }
                  onMouseUp={(e) => {
                    rotate(
                      selectedDesign,
                      setDesignsByView,
                      activePreview,
                      selectedDesign.rotation,
                      getBoundingBox,
                      regionWidth,
                      regionHeight,
                      true,
                    );
                  }}
                />
                <input
                  type="number"
                  min="-180"
                  max="180"
                  value={Math.round(radToDeg(selectedDesign?.rotation))}
                  onChange={(e) => {
                    let val = e.target.value;
                    if (val === "") val = 0;
                    const angle = (parseInt(val) * Math.PI) / 180;
                    rotate(
                      selectedDesign,
                      setDesignsByView,
                      activePreview,
                      angle,
                      getBoundingBox,
                      regionWidth,
                      regionHeight,
                      true,
                    );
                  }}
                  style={{ width: "60px", marginLeft: "8px" }}
                />
              </div>

              {/* 5. Color */}
              {/* <div className="edit-row">
                <label>Color:</label>
                <input
                  type="color"
                  value={selectedDesign.color || "#000000"}
                  onChange={(e) =>
                    updateColor(selectedDesign.id, e.target.value)
                  }
                />
              </div> */}

              {/* 6. Width/Height with aspect toggle */}
              <div className="edit-row">
                <label>Width:</label>
                <input
                  type="number"
                  min="0.1"
                  max={
                    regionHeight > regionWidth ? 1 : regionWidth / regionHeight
                  }
                  step="0.01"
                  value={selectedDesign?.width?.toFixed(2)}
                  onChange={(e) => {
                    let newWidthNorm = parseFloat(e.target.value);
                    if (isNaN(newWidthNorm)) return;
                    newWidthNorm = Math.max(0.1, newWidthNorm);

                    if (selectedDesign.isLocked_aspect_ratio) {
                      const aspect = selectedDesign?.aspect_ratio;
                      const newHeightNorm = newWidthNorm / aspect;
                      updateSize(
                        selectedDesign.id,
                        newWidthNorm,
                        newHeightNorm,
                        setDesignsByView,
                        activePreview,
                        getBoundingBox,
                        regionWidth,
                        regionHeight,
                      );
                    } else {
                      updateSize(
                        selectedDesign.id,
                        newWidthNorm,
                        selectedDesign.height,
                        setDesignsByView,
                        activePreview,
                        getBoundingBox,
                        regionWidth,
                        regionHeight,
                      );
                    }
                  }}
                  style={{
                    width: "80px",
                    marginLeft: "8px",
                    border: "1px solid #ccc",
                  }}
                />
              </div>

              <div className="edit-row">
                <label>Height:</label>
                <input
                  type="number"
                  min="0.1"
                  max={
                    regionHeight < regionWidth ? 1 : regionHeight / regionWidth
                  }
                  step="0.01"
                  value={selectedDesign.height?.toFixed(2)}
                  onChange={(e) => {
                    let newHeightNorm = parseFloat(e.target.value);
                    if (isNaN(newHeightNorm)) return;
                    newHeightNorm = Math.max(0.1, newHeightNorm);

                    if (selectedDesign.isLocked_aspect_ratio) {
                      const aspect = selectedDesign.aspect_ratio;
                      const newWidthNorm = newHeightNorm * aspect;
                      updateSize(
                        selectedDesign.id,
                        newWidthNorm,
                        newHeightNorm,
                        setDesignsByView,
                        activePreview,
                        getBoundingBox,
                        regionWidth,
                        regionHeight,
                      );
                    } else {
                      updateSize(
                        selectedDesign.id,
                        selectedDesign.width,
                        newHeightNorm,
                        setDesignsByView,
                        activePreview,
                        getBoundingBox,
                        regionWidth,
                        regionHeight,
                      );
                    }
                  }}
                  style={{
                    width: "80px",
                    marginLeft: "8px",
                    border: "1px solid #ccc",
                  }}
                />
              </div>

              {/* Aspect Ratio Toggle */}
              <div className="edit-row">
                <button
                  onClick={() =>
                    handleToggleAspectLock(
                      selectedDesign,
                      activePreview,
                      setDesignsByView,
                      getBoundingBox,
                      regionWidth,
                      regionHeight,
                    )
                  }
                  disabled={
                    selectedDesign.isLocked_aspect_ratio &&
                    selectedDesign.rotation !== 0
                  }
                >
                  {selectedDesign.isLocked_aspect_ratio ? (
                    <i class="bi bi-lock-fill"></i>
                  ) : (
                    <i class="bi bi-unlock-fill"></i>
                  )}
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {selectedDesignId && selectedDesign && isCropping && (
        
<SideBarCropper
    design={selectedDesign}
    applyCrop={applyCrop}
    setIsCropping={setIsCropping}
    setDesignsByView={setDesignsByView}
    activePreview={activePreview}
    getBoundingBox={getBoundingBox}
    regionWidth={regionWidth}
    regionHeight={regionHeight}
  />

      )}
    </div>
  );
}

export default TabPanel;
