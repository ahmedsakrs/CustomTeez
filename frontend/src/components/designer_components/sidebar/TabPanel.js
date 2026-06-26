import React, { useState } from "react";
import { Row, Col } from "react-bootstrap";
import CategoryThumb from "./CategoryThumb";
import DesignThumb from "./DesignThumb";
import SideBarCropper from "./SideBarCropper";
import SizeSection from "./SizeSection";
import HorizontalLine from "../../HorizontalLine";
import RotationSection from "./RotationSection";
import ButtonsSection from "./ButtonsSection";

import {
  radToDeg,
  rotate,
  updateSize,
  handleToggleAspectLock,
  checkAfterRotation,
  applyCrop,
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
}) {
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

      {selectedDesignId && selectedDesign && !isCropping && (
        <>
          {activeTab === "editDesign" && (
            <div className="tab-content">
              {/* 1. Layer order */}
              <SizeSection
                regionWidth={regionWidth}
                regionHeight={regionHeight}
                selectedDesign={selectedDesign}
                setDesignsByView={setDesignsByView}
                activePreview={activePreview}
                getBoundingBox={getBoundingBox}
                handleToggleAspectLock={handleToggleAspectLock}
                isHeightZero={isHeightZero}
                setIsHeightZero={setIsHeightZero}
                isHeightBlank={isHeightBlank}
                setIsHeightBlank={setIsHeightBlank}
                isWidthZero={isWidthZero}
                setIsWidthZero={setIsWidthZero}
                isWidthBlank={isWidthBlank}
                setIsWidthBlank={setIsWidthBlank}
              />
              <HorizontalLine
                marginUp={15}
                marginDown={15}
                lineColor={"#333"}
              />
              <RotationSection
                selectedDesign={selectedDesign}
                setDesignsByView={setDesignsByView}
                activePreview={activePreview}
                getBoundingBox={getBoundingBox}
                regionWidth={regionWidth}
                regionHeight={regionHeight}
                setIsHeightZero={setIsHeightZero}
                setIsHeightBlank={setIsHeightBlank}
                setIsWidthZero={setIsWidthZero}
                setIsWidthBlank={setIsWidthBlank}
              />
              <HorizontalLine
                marginUp={15}
                marginDown={15}
                lineColor={"#333"}
              />
              <ButtonsSection
              selectedDesign={selectedDesign}
              activePreview={activePreview}
              setDesignsByView={setDesignsByView}
              setIsCropping={setIsCropping}
              setActiveTab={setActiveTab}
              regionWidth={regionWidth}
              regionHeight={regionHeight}
              setSelectedDesignId={setSelectedDesignId}
              designsByView={designsByView}
              />

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
          setActiveTab={setActiveTab}
        />
      )}
    </div>
  );
}

export default TabPanel;
