import React from "react";
import { applyNewTextImg } from "../../../../utils/designerUtils";

function MobileStyleModal({
  barRef,
  selectedDesign,
  setDesignsByView,
  activePreview,
  regionWidth,
  regionHeight,
  getBoundingBox,
  setActiveTab
}) {
  return (
    <div
      className="mobile-upload-sheet"
      style={{ height: "150px", maxHeight: "150px", minHeight: "150px" }}
      ref={barRef}
    >
      <div className="mobile-product-tabbar" style={{ marginBottom: "3px" }}>
        <h2>{"Style"}</h2>

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
            selectedDesign?.isBold ? "active" : ""
          }`}
          onClick={async (e) => {
            e.stopPropagation();
            await applyNewTextImg(
              selectedDesign.text,
              selectedDesign.fontFamily,
              !selectedDesign.isBold,
              selectedDesign.isItalic,
              selectedDesign.design_color,
              selectedDesign.outline_color,
              selectedDesign.outline_width,
              selectedDesign.text_alignment,
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
          <i className="fa-solid fa-bold"></i>
          <span>Bold</span>
        </button>

        <button
          className={`mobile-flip-btn ${
            selectedDesign?.isItalic ? "active" : ""
          }`}
          onClick={async (e) => {
            e.stopPropagation();
            await applyNewTextImg(
              selectedDesign.text,
              selectedDesign.fontFamily,
              selectedDesign.isBold,
              !selectedDesign.isItalic,
              selectedDesign.design_color,
              selectedDesign.outline_color,
              selectedDesign.outline_width,
              selectedDesign.text_alignment,
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
          <i className="fa-solid fa-italic"></i>
          <span>Italic</span>
        </button>
      </div>
    </div>
  );
}

export default MobileStyleModal;
