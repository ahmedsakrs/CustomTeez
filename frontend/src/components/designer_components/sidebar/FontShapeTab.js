import React, { useMemo, useState, useEffect } from "react";
import debounce from "lodash.debounce";
import { applyNewTextImg } from "../../../utils/designerUtils";

const shapes = [
  { key: "normal", label: "Normal" },
  { key: "curve", label: "Curve" },
  { key: "arch", label: "Arch" },
  { key: "wave", label: "Wave" },
];

export default function FontShapeTab({
  selectedDesign,
  pendingText,
  setActiveTab,
  setDesignsByView,
  updateDesignsByView,
  designsByView,
  activePreview,
  regionWidth,
  regionHeight,
  getBoundingBox,
}) {
  const currentShape = selectedDesign?.text_shape || "normal";
  const debouncedUpdate = useMemo(
    () => debounce((...args) => applyNewTextImg(...args), 200),
    [],
  );

  const [shapeIntensity, setShapeIntensity] = useState(
    selectedDesign?.shape_intensity === 0
      ? 0.25
      : selectedDesign?.shape_intensity,
  );

  useEffect(() => {
    setShapeIntensity(selectedDesign?.shape_intensity || 0);
  }, [selectedDesign?.id, selectedDesign?.shape_intensity]);

  useEffect(() => {
    return () => {
      debouncedUpdate.cancel();
    };
  }, [debouncedUpdate]);

  const applyShape = (shape, updateState = false) => {
    if (updateState) {
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
        shapeIntensity,
        selectedDesign.lineSpacing,
        updateDesignsByView,
        activePreview,
        selectedDesign,
        regionWidth,
        regionHeight,
        getBoundingBox,
      );
    } else {
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
        shapeIntensity,
        selectedDesign.lineSpacing,
        setDesignsByView,
        activePreview,
        selectedDesign,
        regionWidth,
        regionHeight,
        getBoundingBox,
      );
    }
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
            onClick={() => applyShape(shape.key, true)}
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
            min="-0.65"
            max="0.65"
            step="0.1"
            value={shapeIntensity}
            onPointerDown={() => {
              updateDesignsByView(designsByView);
            }}
            onChange={(e) => {
              const newVal = parseFloat(e.target.value);
              setShapeIntensity(newVal);
              debouncedUpdate(
                selectedDesign.text,
                selectedDesign.fontFamily,
                selectedDesign.isBold,
                selectedDesign.isItalic,
                selectedDesign.design_color,
                selectedDesign.outline_color,
                selectedDesign.outline_width,
                currentShape === "normal"
                  ? selectedDesign.text_alignment
                  : "center",
                currentShape,
                newVal,
                selectedDesign.lineSpacing,
                setDesignsByView,
                activePreview,
                selectedDesign,
                regionWidth,
                regionHeight,
                getBoundingBox,
              );
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
              "normal",
              0,
              selectedDesign.lineSpacing,
              updateDesignsByView,
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
