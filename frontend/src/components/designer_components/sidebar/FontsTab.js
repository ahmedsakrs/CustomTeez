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
          onClick={() => {
            applyNewTextImg(
              pendingText || selectedDesign.text,
              font,
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

            // ✅ go back to text tab
            setActiveTab("editText");
          }}
        >
          AaBbCcDd — {font}
        </button>
      ))}

      {/* ✅ ✅ OPTIONAL: no results */}
      {filteredFonts.length === 0 && (
        <div className="no-fonts">No fonts found</div>
      )}
    </div>
  );
}
