import React, { useMemo, useState } from "react";
import debounce from "lodash.debounce";
import { applyNewTextImg } from "../../../utils/designerUtils";

const availableColors = [
  { rgb: "#000000", name: "Black" },
  { rgb: "#FFFFFF", name: "White" },
  { rgb: "#FF0000", name: "Red" },
  { rgb: "#00C853", name: "Green" },
  { rgb: "#2196F3", name: "Blue" },
  { rgb: "#FFC107", name: "Yellow" },
  { rgb: "#9C27B0", name: "Purple" },
  { rgb: "#FF5722", name: "Orange" },
  { rgb: "#607D8B", name: "Grey" },
  { rgb: "#795548", name: "Brown" },
];

function FontColors({
  selectedDesign,
  setDesignsByView,
  activePreview,
  regionWidth,
  regionHeight,
  getBoundingBox,
  setActiveTab,
  isOutline = false,
}) {
  const debouncedUpdate = useMemo(() => debounce(applyNewTextImg, 120), []);
  const [outlineWidth, setOutlineWidth] = useState(
    selectedDesign?.outline_width === 0 || isNaN(selectedDesign?.outline_width)
      ? 2
      : selectedDesign?.outline_width,
  );
  return (
    <div className="vinyl-colors-tab">
      <div className="selected-color-header">
        {isOutline && (
          <span
            className="color-grid-title"
            style={{ fontWeight: "normal", marginRight: "10px" }}
          >
            {selectedDesign?.outline_color
              ? "Selected Color"
              : "Select Outline Color"}
          </span>
        )}

        {!isOutline && (
          <span
            className="color-grid-title"
            style={{ fontWeight: "normal", marginRight: "10px" }}
          >
            Selected Color
          </span>
        )}

        <div
          className="color-swatch"
          style={{
            backgroundColor: !isOutline
              ? selectedDesign?.design_color.rgb
              : selectedDesign?.outline_color?.rgb,
            width: "20px",
            height: "20px",
            borderRadius: "4px",
            border: "2px solid transparent",
            cursor: "default",
          }}
        />
        <span className="color-grid-title">
          {!isOutline
            ? selectedDesign?.design_color.name
            : selectedDesign?.outline_color?.name}
        </span>
      </div>
      <div className="color-grid">
        {availableColors.map((color) => (
          <button
            key={color.rgb}
            className={`color-swatch ${
              (!isOutline &&
                selectedDesign?.design_color.name === color.name) ||
              (isOutline && selectedDesign?.outline_color?.name === color.name)
                ? "active"
                : ""
            }`}
            style={{
              backgroundColor: color.rgb,
            }}
            onClick={() => {
              if (!isOutline) {
                applyNewTextImg(
                  selectedDesign.text,
                  selectedDesign.fontFamily,
                  selectedDesign.isBold,
                  selectedDesign.isItalic,
                  color,
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
              } else {
                applyNewTextImg(
                  selectedDesign.text,
                  selectedDesign.fontFamily,
                  selectedDesign.isBold,
                  selectedDesign.isItalic,
                  selectedDesign.design_color,
                  color,
                  selectedDesign.outline_width || 2,
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
              }
            }}
          />
        ))}
      </div>

      {isOutline && selectedDesign?.outline_color && (
        <div style={{ position: "relative", marginTop: "10px" }}>
          <span
            className="color-grid-title"
            style={{ marginTop: "10px", fontWeight: "normal" }}
          >
            Outline Size
          </span>
          <input
            className="slider"
            style={{
              maxWidth: "100%",
              width: "100%",
              position: "relative",
              zIndex: 2,
            }}
            type="range"
            min="0.5"
            max="4"
            step={0.5}
            value={outlineWidth}
            onChange={(e) => {
              setOutlineWidth(e.target.value);
              debouncedUpdate(
                selectedDesign.text,
                selectedDesign.fontFamily,
                selectedDesign.isBold,
                selectedDesign.isItalic,
                selectedDesign.design_color,
                selectedDesign.outline_color,
                parseFloat(e.target.value),
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
          />

          <div className="slider-ticks">
            {Array.from({ length: 8 }).map((_, i) => (
              <span key={i} />
            ))}
          </div>
        </div>
      )}

      {isOutline && (
        <div className="crop-actions" style={{ minWidth: "100%" }}>
          <button
            disabled={!selectedDesign.outline_color}
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
              applyNewTextImg(
                selectedDesign.text,
                selectedDesign.fontFamily,
                selectedDesign.isBold,
                selectedDesign.isItalic,
                selectedDesign.design_color,
                null,
                0,
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
            Remove Outline
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
      )}
      {!isOutline && (
        <button
          className="text-add-btn"
          style={{
            marginTop: "10px",
            height: "45px",
            width: "80px",
            fontSize: "14px",
          }}
          onClick={() => {
            setActiveTab("editText");
          }}
        >
          Done
        </button>
      )}
    </div>
  );
}

export default FontColors;
