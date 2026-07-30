import React, { useState } from "react";
import { applyNewTextImg } from "../../../utils/designerUtils";

const fonts = [
  "Arial",
  "Roboto",
  "Montserrat",
  "Oswald",
  "Pacifico",
  "Poppins",
  "Open Sans",
];

export default function FontsTab({
  selectedDesign,
  pendingText,
  setActiveTab,
  setDesignsByView,
  activePreview,
  regionWidth,
  regionHeight,
  getBoundingBox,
  isMobile=false,
}) {
  // ✅ ✅ ADDED: search state
  const [search, setSearch] = useState("");

  // ✅ ✅ ADDED: filter logic
  const filteredFonts = fonts.filter((font) =>
    font.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="fonts-tab">
      {/* ✅ ✅ ADDED: search input */}
      <input
        type="text"
        placeholder="Search fonts..."
        className="font-search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* ✅ ✅ CHANGED: use filteredFonts instead of fonts */}
      {filteredFonts.map((font) => (
        <button
          key={font}
          className={`font-preview ${
            selectedDesign?.fontFamily === font ? "active" : ""
          }`}
          style={{
            fontFamily: font,
            maxWidth: "100%",
            width: "100%",
            minHeight: "50px",
          }}
          onClick={(e) => {
            e.stopPropagation();
            applyNewTextImg(
              selectedDesign.text,
              font,
              selectedDesign.isBold,
              selectedDesign.isItalic,
              selectedDesign.design_color,
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
            if(isMobile) {
              setActiveTab("editText");
            }
          }}
        >
          AaBbCcDd — {font}
        </button>
      ))}

      {!isMobile && (
        <button
          className="text-add-btn"
          style={{
            marginTop: "10px",
            height: "45px",
            width: "80px",
            fontSize: "14px",
          }}
          onClick={(e) => {
            e.stopPropagation();
            setActiveTab("editText");
          }}
        >
          Done
        </button>
      )}

      {/* ✅ ✅ OPTIONAL: no results */}
      {filteredFonts.length === 0 && (
        <div className="no-fonts">No fonts found</div>
      )}
    </div>
  );
}
