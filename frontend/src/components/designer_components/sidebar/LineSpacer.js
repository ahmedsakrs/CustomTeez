import React from "react";
import { applyNewTextImg } from "../../../utils/designerUtils";

function LineSpacer({
  selectedDesign,
  setDesignsByView,
  activePreview,
  getBoundingBox,
  regionWidth,
  regionHeight,
}) {
  return (
    <div className="size-row">
      <div className="rotation-left">Line Spacing</div>
      <div className="size-right">
        <input
          className="slider"
          type="range"
          min="0.8"
          max="1.5"
          step={0.1}
          value={selectedDesign?.lineSpacing || 1}
          onChange={(e) =>
            applyNewTextImg(
              selectedDesign.text,
              selectedDesign.fontFamily,
              selectedDesign.isBold,
              selectedDesign.isItalic,
              selectedDesign.design_color,
              selectedDesign.outline_color,
              selectedDesign.outline_width,
              selectedDesign.text_alignment,
              selectedDesign.text_shape,
              selectedDesign.shape_intensity,
              parseFloat(e.target.value),
              setDesignsByView,
              activePreview,
              selectedDesign,
              regionWidth,
              regionHeight,
              getBoundingBox,
            )
          }
        />
      </div>
    </div>
  );
}

export default LineSpacer;
