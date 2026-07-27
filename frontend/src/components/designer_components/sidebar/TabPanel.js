import React from "react";
import { Row, Col } from "react-bootstrap";
import CategoryThumb from "./CategoryThumb";
import DesignThumb from "./DesignThumb";
import SideBarCropper from "./SideBarCropper";
import SizeSection from "./SizeSection";
import HorizontalLine from "../../HorizontalLine";
import RotationSection from "./RotationSection";
import ButtonsSection from "./ButtonsSection";
import TextArea from "./TextArea";
import FontsTab from "./FontsTab";
import FontShapeTab from "./FontShapeTab";
import FontColors from "./FontColors";
import LineSpacer from "./LineSpacer";
import UploaderTab from "./UploaderTab";
import MainTab from "./MainTab";

import {
  handleToggleAspectLock,
} from "../../../utils/designerUtils";

function TabPanel({
  selectedCategory,
  setSelectedCategory,
  designCategories,
  activeTab,
  setActiveTab,
  selectedDesignId,
  setSelectedDesignId,
  activePreview,
  designsByView,
  setDesignsByView,
  updateDesignsByView,
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
  pendingText,
  setPendingText,
  imgRef,
}) {
  const selectedDesign = designsByView[activePreview].find(
    (d) => d.id === selectedDesignId,
  );
  return (
    <div className="tab-content" ref={panelRef}>
      {activeTab === null && <MainTab setActiveTab={setActiveTab} />}

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
                setActiveTab={setActiveTab}
                setSelectedDesignId={setSelectedDesignId}
                imgRef={imgRef}
                updateDesignsByView={updateDesignsByView}
                activePreview={activePreview}
              />
            ))}
          </div>
        </>
      )}

      {(activeTab === "editDesign" || activeTab === "editUpload") && (
        <div className="tab-content">
          {/* 1. Layer order */}
          <SizeSection
            regionWidth={regionWidth}
            regionHeight={regionHeight}
            selectedDesign={selectedDesign}
            setDesignsByView={updateDesignsByView}
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
          <HorizontalLine marginUp={15} marginDown={15} lineColor={"#333"} />
          <RotationSection
            selectedDesign={selectedDesign}
            designsByView={designsByView}
            setDesignsByView={setDesignsByView}
            updateDesignsByView={updateDesignsByView}
            activePreview={activePreview}
            getBoundingBox={getBoundingBox}
            regionWidth={regionWidth}
            regionHeight={regionHeight}
            setIsHeightZero={setIsHeightZero}
            setIsHeightBlank={setIsHeightBlank}
            setIsWidthZero={setIsWidthZero}
            setIsWidthBlank={setIsWidthBlank}
          />
          <HorizontalLine marginUp={15} marginDown={15} lineColor={"#333"} />
          <ButtonsSection
            selectedDesign={selectedDesign}
            activePreview={activePreview}
            setDesignsByView={updateDesignsByView}
            setIsCropping={setIsCropping}
            setActiveTab={setActiveTab}
            regionWidth={regionWidth}
            regionHeight={regionHeight}
            setSelectedDesignId={setSelectedDesignId}
            designsByView={designsByView}
            getBoundingBox={getBoundingBox}
          />
        </div>
      )}

      {activeTab === "Crop" && (
        <SideBarCropper
          design={selectedDesign}
          setIsCropping={setIsCropping}
          setDesignsByView={updateDesignsByView}
          activePreview={activePreview}
          getBoundingBox={getBoundingBox}
          regionWidth={regionWidth}
          regionHeight={regionHeight}
          setActiveTab={setActiveTab}
        />
      )}

      {activeTab === "addText" && (
        <TextArea
          imgRef={imgRef}
          updateDesignsByView={updateDesignsByView}
          setSelectedDesignId={setSelectedDesignId}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          regionWidth={regionWidth}
          regionHeight={regionHeight}
          getBoundingBox={getBoundingBox}
          activePreview={activePreview}
          designsByView={designsByView}
          pendingText={pendingText}
          setPendingText={setPendingText}
        />
      )}

      {activeTab === "editText" && selectedDesign && (
        <div className="tab-content">
          <TextArea
            imgRef={imgRef}
            setSelectedDesignId={setSelectedDesignId}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            regionWidth={regionWidth}
            selectedDesign={selectedDesign}
            regionHeight={regionHeight}
            getBoundingBox={getBoundingBox}
            activePreview={activePreview}
            designsByView={designsByView}
            setDesignsByView={updateDesignsByView}
            pendingText={pendingText}
            setPendingText={setPendingText}
          />

          <HorizontalLine marginUp={15} marginDown={15} lineColor={"#333"} />
          <div className="size-row">
            <div className="rotation-left">Font</div>
            <div className="size-right">
              <button
                className="font-preview"
                style={{ fontSize: "1rem", padding: "1px 2px" }}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveTab("changeFont");
                }}
              >
                AaBbCcDd — {selectedDesign.fontFamily}
              </button>
            </div>
          </div>

          <HorizontalLine marginUp={15} marginDown={15} lineColor={"#333"} />
          <div className="size-row">
            <div className="rotation-left">Font Color</div>
            <div className="size-right">
              <div className="current-color">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveTab("changeFontColor");
                  }}
                  className="font-preview"
                  style={{
                    paddingLeft: "4px",
                    paddingRight: "4px",
                    fontSize: "1rem",
                  }}
                >
                  {selectedDesign.design_color.name}
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveTab("changeFontColor");
                  }}
                  className="color-swatch"
                  style={{
                    backgroundColor: selectedDesign?.design_color.rgb,
                    height: "30px",
                    width: "30px",
                  }}
                />
              </div>
            </div>
          </div>

          <HorizontalLine marginUp={15} marginDown={15} lineColor={"#333"} />
          <div className="size-row">
            <div className="rotation-left">Outline</div>
            <div className="size-right">
              <div className="current-color">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveTab("changeFontOutline");
                  }}
                  className="font-preview"
                  style={{
                    paddingLeft: "4px",
                    paddingRight: "4px",
                    fontSize: "1rem",
                  }}
                >
                  {selectedDesign.outline_color
                    ? selectedDesign.outline_color.name
                    : "Add Outline"}
                </button>

                {selectedDesign?.outline_color && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveTab("changeFontOutline");
                    }}
                    className="color-swatch"
                    style={{
                      backgroundColor: selectedDesign?.outline_color?.rgb,
                      height: "30px",
                      width: "30px",
                    }}
                  />
                )}
              </div>
            </div>
          </div>

          <HorizontalLine marginUp={15} marginDown={15} lineColor={"#333"} />
          <div className="size-row">
            <div className="rotation-left">Font Shape</div>
            <div className="size-right">
              <button
                className="font-preview"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveTab("changeShape");
                }}
              >
                {selectedDesign.text_shape === "normal"
                  ? "Normal"
                  : selectedDesign.text_shape === "curve"
                    ? "Curve"
                    : selectedDesign.text_shape === "arch"
                      ? "Arch"
                      : " Unknown"}
              </button>
            </div>
          </div>

          <HorizontalLine marginUp={15} marginDown={15} lineColor={"#333"} />
          <LineSpacer
            selectedDesign={selectedDesign}
            setDesignsByView={setDesignsByView}
            updateDesignsByView={updateDesignsByView}
            designsByView={designsByView}
            activePreview={activePreview}
            getBoundingBox={getBoundingBox}
            regionWidth={regionWidth}
            regionHeight={regionHeight}
          />

          <HorizontalLine marginUp={15} marginDown={15} lineColor={"#333"} />
          <ButtonsSection
            selectedDesign={selectedDesign}
            activePreview={activePreview}
            setDesignsByView={updateDesignsByView}
            setIsCropping={setIsCropping}
            setActiveTab={setActiveTab}
            regionWidth={regionWidth}
            regionHeight={regionHeight}
            setSelectedDesignId={setSelectedDesignId}
            designsByView={designsByView}
            getBoundingBox={getBoundingBox}
          />

          <HorizontalLine marginUp={15} marginDown={15} lineColor={"#333"} />
          <SizeSection
            regionWidth={regionWidth}
            regionHeight={regionHeight}
            selectedDesign={selectedDesign}
            setDesignsByView={updateDesignsByView}
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
          <HorizontalLine marginUp={15} marginDown={15} lineColor={"#333"} />
          <RotationSection
            selectedDesign={selectedDesign}
            designsByView={designsByView}
            setDesignsByView={setDesignsByView}
            updateDesignsByView={updateDesignsByView}
            activePreview={activePreview}
            getBoundingBox={getBoundingBox}
            regionWidth={regionWidth}
            regionHeight={regionHeight}
            setIsHeightZero={setIsHeightZero}
            setIsHeightBlank={setIsHeightBlank}
            setIsWidthZero={setIsWidthZero}
            setIsWidthBlank={setIsWidthBlank}
          />
        </div>
      )}

      {activeTab === "changeFont" && selectedDesign && (
        <FontsTab
          selectedDesign={selectedDesign}
          pendingText={selectedDesign.text}
          setActiveTab={setActiveTab}
          setDesignsByView={updateDesignsByView}
          activePreview={activePreview}
          regionWidth={regionWidth}
          regionHeight={regionHeight}
          getBoundingBox={getBoundingBox}
        />
      )}

      {activeTab === "changeShape" && selectedDesign && (
        <FontShapeTab
          selectedDesign={selectedDesign}
          pendingText={selectedDesign.text}
          setActiveTab={setActiveTab}
          setDesignsByView={setDesignsByView}
          designsByView={designsByView}
          updateDesignsByView={updateDesignsByView}
          activePreview={activePreview}
          regionWidth={regionWidth}
          regionHeight={regionHeight}
          getBoundingBox={getBoundingBox}
        />
      )}

      {activeTab === "changeFontColor" && selectedDesign && (
        <FontColors
          selectedDesign={selectedDesign}
          pendingText={selectedDesign.text}
          setActiveTab={setActiveTab}
          setDesignsByView={updateDesignsByView}
          updateDesignsByView={updateDesignsByView}
          designsByView={designsByView}
          activePreview={activePreview}
          regionWidth={regionWidth}
          regionHeight={regionHeight}
          getBoundingBox={getBoundingBox}
        />
      )}

      {activeTab === "changeFontOutline" && selectedDesign && (
        <FontColors
          selectedDesign={selectedDesign}
          pendingText={selectedDesign.text}
          setActiveTab={setActiveTab}
          setDesignsByView={setDesignsByView}
          updateDesignsByView={updateDesignsByView}
          designsByView={designsByView}
          activePreview={activePreview}
          regionWidth={regionWidth}
          regionHeight={regionHeight}
          getBoundingBox={getBoundingBox}
          isOutline={true}
        />
      )}

      {activeTab === "uploadDesign" && (
        <UploaderTab
          imgRef={imgRef}
          updateDesignsByView={updateDesignsByView}
          setSelectedDesignId={setSelectedDesignId}
          setActiveTab={setActiveTab}
          getBoundingBox={getBoundingBox}
          activePreview={activePreview}
          regionWidth={regionWidth}
          regionHeight={regionHeight}
        />
      )}
    </div>
  );
}

export default TabPanel;
