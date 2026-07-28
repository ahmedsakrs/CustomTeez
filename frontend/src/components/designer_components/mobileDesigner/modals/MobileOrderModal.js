import React from "react";
import {sendToBack, bringToFront} from '../../../../utils/designerUtils'

function MobileOrderModal({
  barRef,
  selectedDesign,
  setActiveTab,
  activePreview,
  setDesignsByView,
  designsByView,
}) {
  const currentDesigns = designsByView[activePreview] || [];
  const highestZ = Math.max(...currentDesigns.map((d) => d.layer || 0));
  const lowestZ = Math.min(...currentDesigns.map((d) => d.layer || 0));
  return (
    <div
      className="mobile-upload-sheet"
      style={{ height: "150px", maxHeight: "150px", minHeight: "150px" }}
      ref={barRef}
    >
      <div className="mobile-product-tabbar" style={{ marginBottom: "3px" }}>
        <h2>{"Order"}</h2>

        <button
          className="close-btn"
          style={{ paddingTop: "0px", width: "25px", height: "25px" }}
          onClick={() => {
            setActiveTab(
              selectedDesign?.text
                ? "editText"
                : selectedDesign?.type === "upload"
                  ? "editUpload"
                  : "editDesign",
            );
          }}
        >
          <i class="fa fa-times" style={{ fontSize: "25px" }}></i>
        </button>
      </div>
      <div className="mobile-flip-buttons">
        <button
          className="mobile-flip-btn"
          style={{width:"120px"}}
          disabled={selectedDesign?.layer === highestZ}
          onClick={(e) => {
            e.stopPropagation();
            bringToFront(activePreview, selectedDesign.id, setDesignsByView);
          }}
        >
          <i className="bi bi-front"></i>
          <span>Bring To Front</span>
        </button>

        <button
          className="mobile-flip-btn"
          style={{width:"120px"}}
          disabled={selectedDesign?.layer === lowestZ}
          onClick={(e) => {
            e.stopPropagation();
            sendToBack(activePreview, selectedDesign.id, setDesignsByView);
          }}
        >
          <i className="bi bi-back"></i>
          <span>Send To Back</span>
        </button>
      </div>
    </div>
  );
}

export default MobileOrderModal;
