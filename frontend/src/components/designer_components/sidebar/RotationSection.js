import React, { useState, useEffect } from "react";
import { radToDeg, rotate } from "../../../utils/designerUtils";

function RotationSection({
  selectedDesign,
  designsByView,
  setDesignsByView,
  updateDesignsByView,
  activePreview,
  getBoundingBox,
  regionWidth,
  regionHeight,
  isHeightZero,
  setIsHeightZero,
  setIsHeightBlank,
  setIsWidthZero,
  setIsWidthBlank,
}) {
  const [angleDeg, setAngleDeg] = useState(
    Math.round(radToDeg(selectedDesign?.rotation || 0)),
  );
  useEffect(() => {
    if (selectedDesign) {
      setAngleDeg(Math.round(radToDeg(selectedDesign?.rotation || 0)));
    }
  }, [selectedDesign]);
  return (
    <div className="size-row">
      <div className="rotation-left">Rotation</div>
      <div className="size-right">
        <input
          className="slider"
          type="range"
          min="-180"
          max="180"
          step={1}
          value={Math.floor(radToDeg(selectedDesign?.rotation))}
          onPointerDown={() => {
            updateDesignsByView(designsByView);
          }}
          onChange={(e) => {
            setAngleDeg(e.target.value);
            rotate(
              selectedDesign,
              setDesignsByView,
              activePreview,
              (parseInt(e.target.value) * Math.PI) / 180,
              regionWidth,
              regionHeight,
              getBoundingBox,
            );
          }}
          onPointerUp={(e) => {
            rotate(
              selectedDesign,
              setDesignsByView,
              activePreview,
              selectedDesign.rotation,
              regionWidth,
              regionHeight,
              getBoundingBox,
              true,
            );
            setIsWidthBlank(false);
            setIsWidthZero(false);
            setIsHeightBlank(false);
            setIsHeightZero(false);
          }}
        />
        <input
          className="size-input"
          type="number"
          min="-180"
          max="180"
          value={angleDeg}
          onChange={(e) => {
            setAngleDeg(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              let val = e.target.value;
              if (val === "") val = 0;
              const angle = (parseInt(val) * Math.PI) / 180;
              rotate(
                selectedDesign,
                updateDesignsByView,
                activePreview,
                angle,
                regionWidth,
                regionHeight,
                getBoundingBox,
                true,
              );
              setAngleDeg(val);
              setIsWidthBlank(false);
              setIsWidthZero(false);
              setIsHeightBlank(false);
              setIsHeightZero(false);
            }
          }}
          onBlur={(e) => {
            let val = e.target.value;
            if (val === "") val = 0;
            const angle = (parseInt(val) * Math.PI) / 180;
            rotate(
              selectedDesign,
              updateDesignsByView,
              activePreview,
              angle,
              regionWidth,
              regionHeight,
              getBoundingBox,
              true,
            );
            setAngleDeg(val);
            setIsWidthBlank(false);
            setIsWidthZero(false);
            setIsHeightBlank(false);
            setIsHeightZero(false);
          }}
        />
      </div>
    </div>
  );
}

export default RotationSection;
