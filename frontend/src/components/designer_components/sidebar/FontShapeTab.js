import React from "react";
import { applyNewTextImg } from "../../../utils/designerUtils";

const shapes = [
  { key: "normal", label: "Normal" },
  { key: "curve", label: "Curve" },
  { key: "arc", label: "Arc" },
  { key: "wave", label: "Wave" },
];

export default function FontShapeTab({
  selectedDesign,
  pendingText,
  setActiveTab,
  setDesignsByView,
  activePreview,
  regionWidth,
  regionHeight,
  getBoundingBox,
}) {
  const currentShape = selectedDesign?.text_shape || "normal";
  const intensity = selectedDesign?.shape_intensity || 0;

  const applyShape = (shape, newIntensity = intensity) => {
    applyNewTextImg(
      pendingText || selectedDesign.text,
      selectedDesign.fontFamily,
      selectedDesign.isBold,
      selectedDesign.isItalic,
      selectedDesign.design_color,
      selectedDesign.outline_color,
      selectedDesign.outline_width,
      selectedDesign.text_alignment,
      shape,
      newIntensity,
      setDesignsByView,
      activePreview,
      selectedDesign,
      regionWidth,
      regionHeight,
      getBoundingBox,
    );
  };

  return (
    <div className="font-shape-tab">
      {/* ✅ SHAPES GRID */}
      <div className="shape-grid">
        {shapes.map((shape) => (
          <button
            key={shape.key}
            className={`shape-btn ${
              currentShape === shape.key ? "active" : ""
            }`}
            onClick={() => applyShape(shape.key)}
          >
            {shape.label}
          </button>
        ))}
      </div>

      {/* ✅ INTENSITY SLIDER */}
      <div className="shape-slider-wrapper">
        <input
          type="range"
          min="-1"
          max="1"
          step="0.1"
          value={intensity}
          onChange={(e) => {
            const newVal = parseFloat(e.target.value);
            applyShape(currentShape, newVal);
          }}
          className="slider"
          style={{ minWidth: "100%" }}
        />
      </div>

      {/* ✅ BACK BUTTON */}
      <button
        className="shape-back-btn"
        onClick={() => setActiveTab("editText")}
      >
        Reset Shape
      </button>
    </div>
  );
}
