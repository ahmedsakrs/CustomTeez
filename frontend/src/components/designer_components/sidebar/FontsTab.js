import React, { useState, useEffect } from "react";
import { applyNewTextImg } from "../../../utils/designerUtils";
import { useDispatch, useSelector } from "react-redux";
import { listFonts } from "../../../actions/fontActions";
import Loader from "../../Loader";
import Message from "../../Message";

export default function FontsTab({
  selectedDesign,
  pendingText,
  setActiveTab,
  setDesignsByView,
  activePreview,
  regionWidth,
  regionHeight,
  getBoundingBox,
  isMobile = false,
}) {
  const dispatch = useDispatch();
  const fontList = useSelector((state) => state.fontList);
  const { loading, error, fonts } = fontList;

  useEffect(() => {
    dispatch(listFonts());
  }, [dispatch]);

  // ✅ ✅ ADDED: search state
  const [search, setSearch] = useState("");

  // ✅ ✅ ADDED: filter logic
  const filteredFonts = Object.entries(fonts || {}).filter(([fontKey, font]) =>
    font.name.toLowerCase().includes(search.toLowerCase()),
  );

  const loadedFonts = new Set();

  const loadFont = async (fontKey) => {
    const font = fonts[fontKey];
    if (!font.file) return;

    if (loadedFonts.has(fontKey)) {
      return;
    }

    const fontFace = new FontFace(fontKey, `url(${font.file})`);
    await fontFace.load();
    document.fonts.add(fontFace);
    loadedFonts.add(fontKey);
  };

  useEffect(() => {
    filteredFonts.forEach(([fontKey, font]) => {
      loadFont(fontKey);
    });
  }, [filteredFonts]);

  return (
    <div>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant={"danger"}>{error}</Message>
      ) : (
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
          {filteredFonts.map(([fontKey, font]) => (
            <button
              key={fontKey}
              className={`font-preview ${
                selectedDesign?.fontFamily === fontKey ? "active" : ""
              }`}
              style={{
                fontFamily: fontKey,
                maxWidth: "100%",
                width: "100%",
                minHeight: "50px",
              }}
              onClick={async (e) => {
                e.stopPropagation();
                await loadFont(fontKey);
                applyNewTextImg(
                  selectedDesign.text,
                  fontKey,
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
                if (isMobile) {
                  setActiveTab("editText");
                }
              }}
            >
              AaBbCcDd — {fontKey}
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
      )}
    </div>
  );
}
