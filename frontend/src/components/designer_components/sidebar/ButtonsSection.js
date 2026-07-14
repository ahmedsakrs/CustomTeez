import React from "react";
import {
  sendToBack,
  bringToFront,
  flipHorizontal,
  flipVertical,
  duplicateDesign,
  center,
  applyNewTextImg,
} from "../../../utils/designerUtils";

function ButtonsSection({
  selectedDesign,
  activePreview,
  setDesignsByView,
  setIsCropping,
  setActiveTab,
  regionWidth,
  regionHeight,
  setSelectedDesignId,
  designsByView,
  getBoundingBox,
}) {
  const currentDesigns = designsByView[activePreview] || [];
  const highestZ = Math.max(...currentDesigns.map((d) => d.layer || 0));
  const lowestZ = Math.min(...currentDesigns.map((d) => d.layer || 0));
  return (
    <div className="edit-container">
      {/* 1. Layering */}
      <div className="edit-block">
        <div className="edit-group no-gap">
          <button
            disabled={selectedDesign?.layer === highestZ}
            onClick={(e) => {
              e.stopPropagation();
              bringToFront(activePreview, selectedDesign.id, setDesignsByView);
            }}
          >
            <i className="bi bi-front"></i>
          </button>

          <button
            disabled={selectedDesign?.layer === lowestZ}
            onClick={(e) => {
              e.stopPropagation();
              sendToBack(activePreview, selectedDesign.id, setDesignsByView);
            }}
          >
            <i className="bi bi-back"></i>
          </button>
        </div>
        <span className="edit-label">Layer</span>
      </div>

      {selectedDesign.text && (
        <div className="edit-block">
          <div className="edit-group no-gap">
            <button
              disabled={selectedDesign.text_shape !== "normal"}
              className={
                selectedDesign.text_alignment === "left" ? "active" : ""
              }
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
            </button>

            <button
              disabled={selectedDesign.text_shape !== "normal"}
              className={
                selectedDesign.text_alignment === "center" ? "active" : ""
              }
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
            </button>

            <button
              disabled={selectedDesign.text_shape !== "normal"}
              className={
                selectedDesign.text_alignment === "right" ? "active" : ""
              }
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
            </button>
          </div>
          <span className="edit-label">Alignment</span>
        </div>
      )}

      {/* 2. Flip */}
      {selectedDesign.text && (
        <div className="edit-block">
          <div className="edit-group no-gap">
            <button
              className={selectedDesign.isBold ? "active" : ""}
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
            </button>

            <button
              className={selectedDesign.isItalic ? "active" : ""}
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
            </button>
          </div>
          <span className="edit-label">Style</span>
        </div>
      )}

      {/* 2. Flip */}
      <div className="edit-block">
        <div className="edit-group no-gap">
          <button
            className={selectedDesign.horizontalFlip ? "active" : ""}
            onClick={(e) => {
              e.stopPropagation();
              flipHorizontal(
                activePreview,
                selectedDesign.id,
                setDesignsByView,
              );
            }}
          >
            <i className="bi bi-symmetry-vertical"></i>
          </button>

          <button
            className={selectedDesign.verticalFlip ? "active" : ""}
            onClick={(e) => {
              e.stopPropagation();
              flipVertical(activePreview, selectedDesign.id, setDesignsByView);
            }}
          >
            <i className="bi bi-symmetry-horizontal"></i>
          </button>
        </div>
        <span className="edit-label">Flip</span>
      </div>

      <div className="edit-block">
        <div className="edit-group no-gap">
          <button
            onClick={(e) => {
              e.stopPropagation();
              duplicateDesign(
                selectedDesign.id,
                activePreview,
                setDesignsByView,
                regionWidth,
                regionHeight,
                setSelectedDesignId,
              );
            }}
          >
            <i className="fa-solid fa-clone"></i>
          </button>
        </div>
        <span className="edit-label">Duplicate</span>
      </div>

      {!selectedDesign.text && (
        <div className="edit-block">
          <div className="edit-group no-gap">
            <button
              onClick={() => {
                setIsCropping(true);
                setActiveTab("Crop");
              }}
            >
              <i className="fa-solid fa-crop-simple"></i>
            </button>
          </div>
          <span className="edit-label">Crop</span>
        </div>
      )}

      <div className="edit-block">
        <div className="edit-group no-gap">
          <button
            onClick={(e) => {
              e.stopPropagation();
              center(
                selectedDesign.id,
                setDesignsByView,
                activePreview,
                getBoundingBox,
                regionWidth,
                regionHeight,
              );
            }}
          >
            <i className="bi bi-align-center" style={{fontWeight:"bold", fontSize:"17px"}}></i>
          </button>
        </div>
        <span className="edit-label">Center</span>
      </div>
    </div>
  );
}

export default ButtonsSection;
