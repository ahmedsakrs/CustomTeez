import React from "react";
import { Row, Col } from "react-bootstrap";
import CategoryThumb from "./CategoryThumb";
import DesignThumb from "./DesignThumb";

function bringToFront(activePreview, selectedDesignId, setDesignsByView) {
  setDesignsByView((prev) => {
    const designs = [...(prev[activePreview] || [])];
    // sort designs by zIndex ascending
    designs.sort((a, b) => (a.layer || 0) - (b.layer || 0));

    const idx = designs.findIndex((d) => d.id === selectedDesignId);
    if (idx === designs.length - 1) return prev; // already highest

    // swap zIndex with the next higher design
    const current = designs[idx];
    const above = designs[idx + 1];
    const temp = current.layer;
    current.layer = above.layer;
    above.layer = temp;

    return { ...prev, [activePreview]: [...designs] };
  });
}

function sendToBack(activePreview, selectedDesignId, setDesignsByView) {
  setDesignsByView((prev) => {
    const designs = [...(prev[activePreview] || [])];
    // sort designs by zIndex ascending
    designs.sort((a, b) => (a.layer || 0) - (b.layer || 0));

    const idx = designs.findIndex((d) => d.id === selectedDesignId);
    if (idx === 0) return prev; // already lowest

    // swap zIndex with the next lower design
    const current = designs[idx];
    console.log(designs);
    const below = designs[idx - 1];
    const temp = current.layer;
    current.layer = below.layer;
    below.layer = temp;

    return { ...prev, [activePreview]: [...designs] };
  });
}

const flipHorizontal = (activePreview, selectedDesignId, setDesignsByView) => {
  setDesignsByView((prev) => ({
    ...prev,
    [activePreview]: prev[activePreview].map((item) =>
      item.id === selectedDesignId
        ? { ...item, horizontalFlip: !item.horizontalFlip }
        : item,
    ),
  }));
};

const flipVertical = (activePreview, selectedDesignId, setDesignsByView) => {
  setDesignsByView((prev) => ({
    ...prev,
    [activePreview]: prev[activePreview].map((item) =>
      item.id === selectedDesignId
        ? { ...item, verticalFlip: !item.verticalFlip }
        : item,
    ),
  }));
};

const rotate = (
  d,
  setDesignsByView,
  activePreview,
  setRotationAngles,
  angleRad,
) => {
  setDesignsByView((prev) => ({
    ...prev,
    [activePreview]: prev[activePreview].map((item) =>
      item.id === d.id
        ? {
            ...item,
            rotation: angleRad,
          }
        : item,
    ),
  }));

  setRotationAngles((prev) => ({
    ...prev,
    [d.id]: angleRad,
  }));
};

function radToDeg(angleRad) {
  let degrees = angleRad * (180 / Math.PI);
  while (degrees > 180) degrees -= 360;
  while (degrees < -180) degrees += 360;
  return degrees;
}

function TabPanel({
  selectedCategory,
  setSelectedCategory,
  designCategories,
  addDesignCollageToActiveView,
  activeTab,
  setActiveTab,
  selectedDesignId,
  activePreview,
  designsByView,
  setDesignsByView,
  panelRef,
  getBoundingBox,
  regionWidth,
  regionHeight,
  setRotationAngles,
}) {
  const currentDesigns = designsByView[activePreview] || [];
  const highestZ = Math.max(...currentDesigns.map((d) => d.layer || 1));
  const lowestZ = Math.min(...currentDesigns.map((d) => d.layer || 0));
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

      {selectedDesignId && (
        <>
          {activeTab === "editDesign" && selectedDesignId && (
            <div className="tab-content">
              {/* 1. Layer order */}
              <div className="edit-row">
                <button
                  disabled={
                    designsByView[activePreview].find(
                      (d) => d.id === selectedDesignId,
                    ).layer === highestZ
                  }
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
                  disabled={
                    designsByView[activePreview].find(
                      (d) => d.id === selectedDesignId,
                    ).layer === lowestZ
                  }
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
              {/* <div className="edit-row">
                <button onClick={() => startCrop(selectedDesign.id)}>
                  ✂️ Crop
                </button>
              </div> */}

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
              </div>

              {/* 4. Rotate */}
              <div className="edit-row">
                <label>Rotate:</label>
                <input
                  type="range"
                  min="-180"
                  max="180"
                  value={Math.floor(
                    radToDeg(
                      designsByView[activePreview].find(
                        (d) => d.id === selectedDesignId,
                      ).rotation,
                    ),
                  )}
                  onChange={(e) =>
                    rotate(
                      designsByView[activePreview].find(
                        (d) => d.id === selectedDesignId,
                      ),
                      setDesignsByView,
                      activePreview,
                      setRotationAngles,
                      (parseInt(e.target.value) * Math.PI) / 180,
                    )
                  }
                  onMouseUp={(e) => {
                    let d = designsByView[activePreview].find(
                      (d) => d.id === selectedDesignId,
                    );
                    let bbox = getBoundingBox(
                      d.width * regionWidth,
                      d.height * regionHeight,
                      d.rotation,
                    );
                    let posX = d.x * regionWidth;
                    let posY = d.y * regionHeight;

                    if (posX < 0) posX = 0;
                    if (posY < 0) posY = 0;
                    if (posX + bbox.width > regionWidth)
                      posX = regionWidth - bbox.width;
                    if (posY + bbox.height > regionHeight)
                      posY = regionHeight - bbox.height;

                    if (
                      bbox.width > regionWidth ||
                      bbox.height > regionHeight
                    ) {
                      const widthRatio = regionWidth / bbox.width;
                      const heightRatio = regionHeight / bbox.height;
                      const scale = Math.min(widthRatio, heightRatio);

                      const newWidth = d.width * regionWidth * scale;
                      const newHeight = d.height * regionHeight * scale;

                      setDesignsByView((prev) => ({
                        ...prev,
                        [activePreview]: prev[activePreview].map((item) =>
                          item.id === d.id
                            ? {
                                ...item,
                                x: posX / regionWidth,
                                y: posY / regionHeight,
                                width: newWidth / regionWidth,
                                height: newHeight / regionHeight,
                              }
                            : item,
                        ),
                      }));
                    } else {
                      setDesignsByView((prev) => ({
                        ...prev,
                        [activePreview]: prev[activePreview].map((item) =>
                          item.id === d.id
                            ? {
                                ...item,
                                x: posX / regionWidth,
                                y: posY / regionHeight,
                              }
                            : item,
                        ),
                      }));
                    }
                  }}
                />
                <input
                  type="number"
                  min="-180"
                  max="180"
                  value={Math.floor(
                    radToDeg(
                      designsByView[activePreview].find(
                        (d) => d.id === selectedDesignId,
                      ).rotation,
                    ),
                  )}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === "") {
                      setRotationAngles((prev) => ({
                        ...prev,
                        [selectedDesignId]: 0,
                      }));

                      setDesignsByView((prev) => ({
                        ...prev,
                        [activePreview]: prev[activePreview].map((item) =>
                          item.id === selectedDesignId
                            ? {
                                ...item,
                                rotation: 0,
                              }
                            : item,
                        ),
                      }));
                    }
                    const angle = (parseInt(val) * Math.PI) / 180;
                    let d = designsByView[activePreview].find(
                      (d) => d.id === selectedDesignId,
                    );
                    let bbox = getBoundingBox(
                      d.width * regionWidth,
                      d.height * regionHeight,
                      angle,
                    );
                    let posX = d.x * regionWidth;
                    let posY = d.y * regionHeight;

                    if (posX < 0) posX = 0;
                    if (posY < 0) posY = 0;
                    if (posX + bbox.width > regionWidth)
                      posX = regionWidth - bbox.width;
                    if (posY + bbox.height > regionHeight)
                      posY = regionHeight - bbox.height;

                    if (
                      bbox.width > regionWidth ||
                      bbox.height > regionHeight
                    ) {
                      const widthRatio = regionWidth / bbox.width;
                      const heightRatio = regionHeight / bbox.height;
                      const scale = Math.min(widthRatio, heightRatio);

                      const newWidth = d.width * regionWidth * scale;
                      const newHeight = d.height * regionHeight * scale;

                      setDesignsByView((prev) => ({
                        ...prev,
                        [activePreview]: prev[activePreview].map((item) =>
                          item.id === d.id
                            ? {
                                ...item,
                                x: posX / regionWidth,
                                y: posY / regionHeight,
                                width: newWidth / regionWidth,
                                height: newHeight / regionHeight,
                              }
                            : item,
                        ),
                      }));
                    } else {
                      setDesignsByView((prev) => ({
                        ...prev,
                        [activePreview]: prev[activePreview].map((item) =>
                          item.id === d.id
                            ? {
                                ...item,
                                x: posX / regionWidth,
                                y: posY / regionHeight,
                              }
                            : item,
                        ),
                      }));
                    }

                    rotate(
                      designsByView[activePreview].find(
                        (d) => d.id === selectedDesignId,
                      ),
                      setDesignsByView,
                      activePreview,
                      setRotationAngles,
                      angle,
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
              {/* <div className="edit-row">
                <label>Width:</label>
                <input
                  type="number"
                  value={selectedDesign.width}
                  onChange={(e) =>
                    updateSize(
                      selectedDesign.id,
                      "width",
                      parseInt(e.target.value),
                    )
                  }
                />
                <label>Height:</label>
                <input
                  type="number"
                  value={selectedDesign.height}
                  onChange={(e) =>
                    updateSize(
                      selectedDesign.id,
                      "height",
                      parseInt(e.target.value),
                    )
                  }
                />
                <label>
                  <input
                    type="checkbox"
                    checked={lockAspect}
                    onChange={() => setLockAspect(!lockAspect)}
                  />
                  Lock Aspect Ratio
                </label>
              </div> */}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default TabPanel;
