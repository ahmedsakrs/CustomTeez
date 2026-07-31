import React, { useMemo, useState, useEffect } from "react";
import debounce from "lodash.debounce";
import { applyNewTextImg } from "../../../utils/designerUtils";

function LineSpacer({
  selectedDesign,
  setDesignsByView,
  activePreview,
  getBoundingBox,
  regionWidth,
  regionHeight,
  updateDesignsByView,
  designsByView,
  isMobile = false,
}) {
  const debouncedUpdate = useMemo(
    () => debounce((...args) => applyNewTextImg(...args), 200),
    [],
  );
  const [lineHeight, setLineHeight] = useState(
    selectedDesign?.lineSpacing || 1,
  );

  useEffect(() => {
    setLineHeight(selectedDesign?.lineSpacing || 1);
  }, [selectedDesign?.id, selectedDesign?.lineSpacing]);

  useEffect(() => {
    return () => {
      debouncedUpdate.cancel();
    };
  }, [debouncedUpdate]);

  return (
    <div>
      {!isMobile && (
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
              onPointerDown={() => {
                updateDesignsByView(designsByView);
              }}
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
      )}
      {isMobile && (
        <input
          className="slider"
          type="range"
          min="0.6"
          max="1.5"
          step={0.1}
          style={{ maxWidth: "100%", width: "100%",marginTop:"25px" }}
          value={lineHeight}
          onPointerDown={() => {
            updateDesignsByView(designsByView);
          }}
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
      )}
    </div>
  );
}

export default LineSpacer;
