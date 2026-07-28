import React from "react";
import { flipVertical, flipHorizontal } from "../../../../utils/designerUtils";

function MobileFlipModal({
  barRef,
  selectedDesign,
  setActiveTab,
  activePreview,
  setDesignsByView,
}) {
  return (
    <div
      className="mobile-upload-sheet"
      style={{ height: "150px", maxHeight: "150px", minHeight: "150px" }}
      ref={barRef}
    >
      <div className="mobile-product-tabbar" style={{marginBottom:"3px"}}>
        <h2>{"Flip"}</h2>

        <button
          className="close-btn"
          style={{ paddingTop: "0px", width: "25px", height: "25px" }}
          onClick={() => {
            setActiveTab(
              selectedDesign.type === "upload" ? "editUpload" : "editDesign",
            );
          }}
        >
          <i class="fa fa-times" style={{ fontSize: "25px" }}></i>
        </button>
      </div>
      <div className="mobile-flip-buttons">
        <button
          className={`mobile-flip-btn ${
            selectedDesign?.horizontalFlip ? "active" : ""
          }`}
          onClick={(e) => {
            e.stopPropagation();

            flipHorizontal(activePreview, selectedDesign.id, setDesignsByView);
          }}
        >
          <i className="bi bi-symmetry-vertical"></i>
          <span>Vertical</span>
        </button>

        <button
          className={`mobile-flip-btn ${
            selectedDesign?.verticalFlip ? "active" : ""
          }`}
          onClick={(e) => {
            e.stopPropagation();

            flipVertical(activePreview, selectedDesign.id, setDesignsByView);
          }}
        >
          <i className="bi bi-symmetry-horizontal"></i>

          <span>Horizontal</span>
        </button>
      </div>
    </div>
  );
}

export default MobileFlipModal;
