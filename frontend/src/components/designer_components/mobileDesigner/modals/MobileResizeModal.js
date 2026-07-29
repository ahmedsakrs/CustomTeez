import React, { useState, useEffect } from "react";
import {
  updateSize,
  handleToggleAspectLock,
  radToDeg
} from "../../../../utils/designerUtils";

function MobileResizeModal({
  selectedDesign,
  regionWidth,
  regionHeight,
  setIsWidthBlank,
  setIsWidthZero,
  setIsHeightBlank,
  setIsHeightZero,
  setDesignsByView,
  activePreview,
  getBoundingBox,
  setActiveTab,
  barRef
}) {
  const [localWidth, setLocalWidth] = useState(selectedDesign?.width);
  const [localHeight, setLocalHeight] = useState(selectedDesign?.height);
  useEffect(() => {
    if (selectedDesign) {
      setLocalWidth(selectedDesign.width);
      setLocalHeight(selectedDesign.height);
    }
  }, [selectedDesign]);
  return (
    <div
      className="mobile-upload-sheet"
      style={{ height: "150px", maxHeight: "150px", minHeight: "150px" }}
      ref={barRef}
    >
      <div className="mobile-product-tabbar" style={{ marginBottom: "3px" }}>
        <h2>{"Resize (W × H)"}</h2>

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
      <div className="mobile-rotation-input-row">
        <input
          type="number"
          className="mobile-rotation-input"
          min="0.05"
          max={regionHeight > regionWidth ? 1 : regionWidth / regionHeight}
          step="0.01"
          value={localWidth}
          onChange={(e) => {
            setLocalWidth(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              let newWidthNorm = parseFloat(localWidth);
              if (newWidthNorm === selectedDesign.width) return;
              if (isNaN(newWidthNorm)) {
                setIsWidthBlank(true);
                setIsWidthZero(false);
                return;
              } else if (newWidthNorm === 0) {
                setIsWidthBlank(false);
                setIsWidthZero(true);
                return;
              } else {
                setIsWidthBlank(false);
                setIsWidthZero(false);
              }
              newWidthNorm = Math.max(0.05, newWidthNorm);
              setLocalWidth((newWidthNorm * 1000) / 1000);

              if (selectedDesign?.isLocked_aspect_ratio) {
                const aspect = selectedDesign?.aspect_ratio;
                let newHeightNorm = newWidthNorm / aspect;
                if (newHeightNorm < 0.05) {
                  newHeightNorm = 0.05;
                  newWidthNorm = newHeightNorm * aspect;
                  setLocalHeight((newHeightNorm * 1000) / 1000);
                  setLocalWidth((newWidthNorm * 1000) / 1000);
                }
                updateSize(
                  selectedDesign?.id,
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
                  selectedDesign?.id,
                  newWidthNorm,
                  selectedDesign?.height,
                  setDesignsByView,
                  activePreview,
                  getBoundingBox,
                  regionWidth,
                  regionHeight,
                );
              }
            }
          }}
          onBlur={() => {
            let newWidthNorm = parseFloat(localWidth);
            if (newWidthNorm === selectedDesign.width) return;
            if (isNaN(newWidthNorm)) {
              setIsWidthBlank(true);
              setIsWidthZero(false);
              return;
            } else if (newWidthNorm === 0) {
              setIsWidthBlank(false);
              setIsWidthZero(true);
              return;
            } else {
              setIsWidthBlank(false);
              setIsWidthZero(false);
            }
            newWidthNorm = Math.max(0.05, newWidthNorm);
            setLocalWidth((newWidthNorm * 1000) / 1000);

            if (selectedDesign?.isLocked_aspect_ratio) {
              const aspect = selectedDesign?.aspect_ratio;
              let newHeightNorm = newWidthNorm / aspect;
              if (newHeightNorm < 0.05) {
                newHeightNorm = 0.05;
                newWidthNorm = newHeightNorm * aspect;
                setLocalHeight((newHeightNorm * 1000) / 1000);
                setLocalWidth((newWidthNorm * 1000) / 1000);
              }
              updateSize(
                selectedDesign?.id,
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
                selectedDesign?.id,
                newWidthNorm,
                selectedDesign?.height,
                setDesignsByView,
                activePreview,
                getBoundingBox,
                regionWidth,
                regionHeight,
              );
            }
          }}
        />

        <span className="size-x"> x </span>

        <input
          className="mobile-rotation-input"
          type="number"
          min="0.05"
          max={regionHeight < regionWidth ? 1 : regionHeight / regionWidth}
          step="0.01"
          value={localHeight}
          onChange={(e) => {
            setLocalHeight(e.target.value);
          }}
          onBlur={() => {
            let newHeightNorm = parseFloat(localHeight);
            if (newHeightNorm === selectedDesign.height) return;
            if (isNaN(newHeightNorm)) {
              setIsHeightBlank(true);
              setIsHeightZero(false);
              return;
            } else if (newHeightNorm === 0) {
              setIsHeightBlank(false);
              setIsHeightZero(true);
              return;
            } else {
              setIsHeightBlank(false);
              setIsHeightZero(false);
            }
            newHeightNorm = Math.max(0.05, newHeightNorm);
            setLocalHeight((newHeightNorm * 1000) / 1000);

            if (selectedDesign?.isLocked_aspect_ratio) {
              const aspect = selectedDesign.aspect_ratio;
              let newWidthNorm = newHeightNorm * aspect;
              if (newWidthNorm < 0.05) {
                newWidthNorm = 0.05;
                newHeightNorm = newWidthNorm / aspect;
                setLocalHeight((newHeightNorm * 1000) / 1000);
                setLocalWidth((newWidthNorm * 1000) / 1000);
              }
              updateSize(
                selectedDesign?.id,
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
                selectedDesign?.id,
                selectedDesign?.width,
                newHeightNorm,
                setDesignsByView,
                activePreview,
                getBoundingBox,
                regionWidth,
                regionHeight,
              );
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              let newHeightNorm = parseFloat(localHeight);
              if (newHeightNorm === selectedDesign.height) return;
              if (isNaN(newHeightNorm)) {
                setIsHeightBlank(true);
                setIsHeightZero(false);
                return;
              } else if (newHeightNorm === 0) {
                setIsHeightBlank(false);
                setIsHeightZero(true);
                return;
              } else {
                setIsHeightBlank(false);
                setIsHeightZero(false);
              }
              newHeightNorm = Math.max(0.05, newHeightNorm);
              setLocalHeight((newHeightNorm * 1000) / 1000);

              if (selectedDesign?.isLocked_aspect_ratio) {
                const aspect = selectedDesign.aspect_ratio;
                let newWidthNorm = newHeightNorm * aspect;
                if (newWidthNorm < 0.05) {
                  newWidthNorm = 0.05;
                  newHeightNorm = newWidthNorm / aspect;
                  setLocalHeight((newHeightNorm * 1000) / 1000);
                  setLocalWidth((newWidthNorm * 1000) / 1000);
                }
                updateSize(
                  selectedDesign?.id,
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
                  selectedDesign?.id,
                  selectedDesign?.width,
                  newHeightNorm,
                  setDesignsByView,
                  activePreview,
                  getBoundingBox,
                  regionWidth,
                  regionHeight,
                );
              }
            }
          }}
        />

        {/* Aspect Ratio Toggle */}
        <button
          className="tab-edit-btn"
          style={{width:"40px", height:"40px"}}
          onClick={(e) => {
            e.stopPropagation();
            handleToggleAspectLock(
              selectedDesign,
              activePreview,
              setDesignsByView,
              getBoundingBox,
              regionWidth,
              regionHeight,
            );
          }}
          disabled={
            selectedDesign?.isLocked_aspect_ratio &&
            Math.round(radToDeg(selectedDesign?.rotation)) !== 0
          }
        >
          {selectedDesign?.isLocked_aspect_ratio ? (
            <i class="bi bi-lock-fill" style={{fontSize:"23px"}}></i>
          ) : (
            <i class="bi bi-unlock-fill" style={{fontSize:"23px"}}></i>
          )}
          <div className="tooltip">
            {selectedDesign?.isLocked_aspect_ratio && selectedDesign?.rotation
              ? "Set rotation=0 to Unlock Aspect Ratio"
              : selectedDesign?.isLocked_aspect_ratio
                ? "Unlock Aspect Ratio"
                : "Lock Aspect Ratio"}
          </div>
        </button>
      </div>
    </div>
  );
}

export default MobileResizeModal;
