import React, { useMemo, useState } from "react";
import debounce from "lodash.debounce";
import { applyNewTextImg } from "../../../utils/designerUtils";

function LineSpacer({
  selectedDesign,
  setDesignsByView,
  activePreview,
  getBoundingBox,
  regionWidth,
  regionHeight,
}) {
  const debouncedUpdate = useMemo(() => debounce(applyNewTextImg, 200), []);
  const [lineHeight, setLineHeight] = useState(
    selectedDesign?.lineSpacing || 1,
  );

  return (
    <div className="size-row">
      <div className="rotation-left">Line Spacing</div>
      <div className="size-right">
        <input
          className="slider"
          type="range"
          min="0.6"
          max="1.5"
          step={0.1}
          value={lineHeight}
          onChange={(e) => {
            setLineHeight(parseFloat(e.target.value));
            debouncedUpdate(
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
            );
          }}
        />
      </div>
    </div>
  );
}

export default LineSpacer;
