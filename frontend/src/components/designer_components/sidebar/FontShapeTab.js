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
  const intensity =
    selectedDesign?.shape_intensity === 0
      ? 0.25
      : selectedDesign?.shape_intensity;

  const applyShape = (shape, newIntensity = intensity) => {
    applyNewTextImg(
      selectedDesign.text,
      selectedDesign.fontFamily,
      selectedDesign.isBold,
      selectedDesign.isItalic,
      selectedDesign.design_color,
      selectedDesign.outline_color,
      selectedDesign.outline_width,
      shape === "normal" ? selectedDesign.text_alignment : "center",
      shape,
      newIntensity,
      selectedDesign.lineSpacing,
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
      {currentShape !== "normal" && (
        <div className="shape-slider-wrapper">
          <input
            type="range"
            min="-0.45"
            max="0.45"
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
      )}

      <div className="crop-actions" style={{ minWidth: "100%" }}>
        <button
          className="panel-btn"
          disabled={currentShape === "normal"}
          style={{
            padding: "0px 0px",
            marginLeft: "0px",
            marginTop: "10px",
            height: "45px",
            width: "120px",
            fontSize: "13px",
          }}
          onClick={() => {
            applyNewTextImg(
              selectedDesign.text,
              selectedDesign.fontFamily,
              selectedDesign.isBold,
              selectedDesign.isItalic,
              selectedDesign.design_color,
              selectedDesign.outline_color,
              selectedDesign.outline_width,
              selectedDesign.text_alignment,
              null,
              0,
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
          Reset Shape
        </button>

        <button
          className="panel-btn"
          style={{
            padding: "0px 0px",
            marginLeft: "0px",
            marginTop: "10px",
            height: "45px",
            width: "120px",
            fontSize: "13px",
          }}
          onClick={() => {
            setActiveTab("editText");
          }}
        >
          Done
        </button>
      </div>
    </div>
  );
}
