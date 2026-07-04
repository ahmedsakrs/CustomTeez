import React from "react";
import {
  findFittingFontSize,
  textToImage,
  getNewSizePos,
  applyNewTextImg,
} from "../../../utils/designerUtils";

function TextArea({
  addDesignCollageToActiveView,
  setSelectedDesignId,
  activeTab,
  setActiveTab,
  regionWidth,
  regionHeight,
  selectedDesign,
  getBoundingBox,
  activePreview,
  designsByView,
  setDesignsByView,
  pendingText,
  setPendingText,
}) {
  return (
    <div className="text-panel">
      <textarea
        className="text-input"
        placeholder="Type your text here..."
        rows={pendingText.split("\n").length}
        value={pendingText}
        onClick={(e) => {
          e.stopPropagation();
          if (e.target.scrollHeight > 200) {
            e.target.style.overflowY = "auto";
          } else {
            e.target.style.overflowY = "hidden";
          }
        }}
        onChange={(e) => {
          setPendingText(e.target.value);

          e.target.style.height = "auto";
          e.target.style.height = e.target.scrollHeight + "px";

          if (e.target.scrollHeight > 200) {
            e.target.style.overflowY = "auto";
          } else {
            e.target.style.overflowY = "hidden";
          }
        }}
      />

      <button
        className="text-update-btn"
        disabled={!pendingText.trim()}
        onClick={async(e) => {
          if (activeTab === "addText") {
            e.stopPropagation();

            if (pendingText.trim() !== "") {
              const maxFontSizePx = findFittingFontSize(
                pendingText,
                regionWidth,
                "Arial",
              );

              const imageData = await textToImage({
                text: pendingText,
                fontSizePx: maxFontSizePx,
                fontFamily: "Arial",
                lineHeightMultiplier: 1,
                textColor: "black",
                textAlign: "center",
              });

              const id = `text-${Date.now()}`;
              let selectedDesign = {
                id: id,
                src: imageData.img,
                text: pendingText,
                is_colorable: true,
                x: 0,
                y: 0,
                width: 0.5,
                height: ((imageData.height * 0.5) / imageData.width).toFixed(3),
                aspect_ratio: imageData.width / imageData.height,
                rotation: 0,
                fontFamily: "Arial",
                isLocked_aspect_ratio: true,
                type: "text",
                design_color: {rgb: "#000000", name: "Black"},
                design_color_name: "Black",
                outline_width: 0,
                outline_color: null,
                text_alignment: "center",
                text_shape: "normal",
                shape_intensity: 0,
              };

              addDesignCollageToActiveView({
                designs: [
                  getNewSizePos(
                    getBoundingBox,
                    selectedDesign,
                    activePreview,
                    regionWidth,
                    regionHeight,
                    0,
                  ),
                ],
              });
              setSelectedDesignId(id);
              if (activeTab === "addText") {
                setActiveTab("editText");
              }
            }
          } else {
            e.stopPropagation();

            if (pendingText.trim() !== "") {
              await applyNewTextImg(
                pendingText,
                selectedDesign.fontFamily,
                selectedDesign.isBold,
                selectedDesign.isItalic,
                selectedDesign.design_color,
                selectedDesign.outline_color,
                selectedDesign.outline_width,
                selectedDesign.text_alignment,
                selectedDesign.text_shape,
                selectedDesign.shape_intensity,
                setDesignsByView,
                activePreview,
                selectedDesign,
                regionWidth,
                regionHeight,
                getBoundingBox,
              );
            }
          }
        }}
      >
        {activeTab === "addText" ? "Add Text" : "Update Text"}
      </button>
    </div>
  );
}

export default TextArea;
