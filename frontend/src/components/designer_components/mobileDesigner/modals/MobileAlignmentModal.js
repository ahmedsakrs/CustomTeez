import React from "react";
import { applyNewTextImg } from "../../../../utils/designerUtils";

function MobileAlignmentModal({
  barRef,
  setActiveTab,
  selectedDesign,
  regionWidth,
  regionHeight,
  setDesignsByView,
  activePreview,
  getBoundingBox,
}) {
  return (
    <div
      className="mobile-upload-sheet"
      style={{ height: "150px", maxHeight: "150px", minHeight: "150px" }}
      ref={barRef}
    >
      <div className="mobile-product-tabbar" style={{ marginBottom: "3px" }}>
        <h2>{"Text Align"}</h2>

        <button
          className="close-btn"
          style={{ paddingTop: "0px", width: "25px", height: "25px" }}
          onClick={() => {
            setActiveTab("editText");
          }}
        >
          <i class="fa fa-times" style={{ fontSize: "25px" }}></i>
        </button>
      </div>
      <div className="mobile-flip-buttons">
        <button
          className={`mobile-flip-btn ${
            selectedDesign?.text_alignment === "left" ? "active" : ""
          }`}
          onClick={async (e) => {
            e.stopPropagation();
            await applyNewTextImg(
              selectedDesign.text,
              selectedDesign.fontFamily,
              selectedDesign.isBold,
              selectedDesign.isItalic,
              selectedDesign.design_color,
              selectedDesign.outline_color,
              selectedDesign.outline_width,
              "left",
              selectedDesign.text_shape,
              selectedDesign.shape_intensity,
              selectedDesign.lineSpacing,
              setDesignsByView,
              activePreview,
              selectedDesign,
              regionWidth,
              regionHeight,
              getBoundingBox,
            );
          }}
        >
          <i className="fa-solid fa-align-left"></i>
          <span>Left</span>
        </button>

        <button
          className={`mobile-flip-btn ${
            selectedDesign?.text_alignment === "center" ? "active" : ""
          }`}
          onClick={async (e) => {
            e.stopPropagation();
            await applyNewTextImg(
              selectedDesign.text,
              selectedDesign.fontFamily,
              selectedDesign.isBold,
              selectedDesign.isItalic,
              selectedDesign.design_color,
              selectedDesign.outline_color,
              selectedDesign.outline_width,
              "center",
              selectedDesign.text_shape,
              selectedDesign.shape_intensity,
              selectedDesign.lineSpacing,
              setDesignsByView,
              activePreview,
              selectedDesign,
              regionWidth,
              regionHeight,
              getBoundingBox,
            );
          }}
        >
          <i className="fa-solid fa-align-center"></i>
          <span>Center</span>
        </button>

        <button
          className={`mobile-flip-btn ${
            selectedDesign?.text_alignment === "right" ? "active" : ""
          }`}
          onClick={async (e) => {
            e.stopPropagation();
            await applyNewTextImg(
              selectedDesign.text,
              selectedDesign.fontFamily,
              selectedDesign.isBold,
              selectedDesign.isItalic,
              selectedDesign.design_color,
              selectedDesign.outline_color,
              selectedDesign.outline_width,
              "right",
              selectedDesign.text_shape,
              selectedDesign.shape_intensity,
              selectedDesign.lineSpacing,
              setDesignsByView,
              activePreview,
              selectedDesign,
              regionWidth,
              regionHeight,
              getBoundingBox,
            );
          }}
        >
          <i className="fa-solid fa-align-right"></i>
          <span>Right</span>
        </button>
      </div>
    </div>
  );
}

export default MobileAlignmentModal;
