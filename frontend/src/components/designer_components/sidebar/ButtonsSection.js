import React from "react";
import {
  sendToBack,
  bringToFront,
  flipHorizontal,
  flipVertical,
  duplicateDesign,
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
}) {
  const currentDesigns = designsByView[activePreview] || [];
  const highestZ = Math.max(...currentDesigns.map((d) => d.layer || 1));
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
    </div>
  );
}

export default ButtonsSection;
