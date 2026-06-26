import React, { useState, useRef, useEffect } from "react";

export default function SideBarCropper({
  design,
  applyCrop,
  setIsCropping,
  setDesignsByView,
  activePreview,
  getBoundingBox,
  regionWidth,
  regionHeight,
  setActiveTab
}) {
  const containerRef = useRef(null);

  const [cropBox, setCropBox] = useState(design.crop);
  const [showGrid, setShowGrid] = useState(false);

  // ✅ Move crop box
  const startDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();

    setShowGrid(true);

    const startX = e.clientX;
    const startY = e.clientY;
    const startBox = { ...cropBox };

    const handleMove = (ev) => {
      const dx = ev.clientX - startX;
      const dy = ev.clientY - startY;

      const container = containerRef.current.getBoundingClientRect();

      let newX = startBox.x + dx / container.width;
      let newY = startBox.y + dy / container.height;

      // clamp inside container
      newX = Math.max(0, Math.min(newX, 1 - startBox.width));
      newY = Math.max(0, Math.min(newY, 1 - startBox.height));

      setCropBox({
        ...startBox,
        x: newX,
        y: newY,
      });
    };

    const handleUp = () => {
      setShowGrid(false);
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
  };

  // ✅ Resize edges + corners
  const startResize = (direction, e) => {
    e.preventDefault();
    e.stopPropagation();

    setShowGrid(true);

    const startX = e.clientX;
    const startY = e.clientY;
    const startBox = { ...cropBox };

    const handleMove = (ev) => {
      const container = containerRef.current.getBoundingClientRect();
      const dx = (ev.clientX - startX) / container.width;
      const dy = (ev.clientY - startY) / container.height;

      let newBox = { ...startBox };

      // edges
      if (direction === "right") {
        newBox.width = Math.max(0.2, startBox.width + dx);
      }
      if (direction === "left") {
        newBox.x = startBox.x + dx;
        newBox.width = Math.max(0.2, startBox.width - dx);
      }
      if (direction === "bottom") {
        newBox.height = Math.max(0.2, startBox.height + dy);
      }
      if (direction === "top") {
        newBox.y = startBox.y + dy;
        newBox.height = Math.max(0.2, startBox.height - dy);
      }

      // corners
      if (direction === "se") {
        newBox.width = Math.max(0.2, startBox.width + dx);
        newBox.height = Math.max(0.2, startBox.height + dy);
      }
      if (direction === "sw") {
        newBox.x = startBox.x + dx;
        newBox.width = Math.max(0.2, startBox.width - dx);
        newBox.height = Math.max(0.2, startBox.height + dy);
      }
      if (direction === "ne") {
        newBox.y = startBox.y + dy;
        newBox.height = Math.max(0.2, startBox.height - dy);
        newBox.width = Math.max(0.2, startBox.width + dx);
      }
      if (direction === "nw") {
        newBox.x = startBox.x + dx;
        newBox.y = startBox.y + dy;
        newBox.width = Math.max(0.2, startBox.width - dx);
        newBox.height = Math.max(0.2, startBox.height - dy);
      }

      // clamp
      newBox.x = Math.max(0, newBox.x);
      newBox.y = Math.max(0, newBox.y);
      newBox.width = Math.min(newBox.width, 1 - newBox.x);
      newBox.height = Math.min(newBox.height, 1 - newBox.y);

      setCropBox(newBox);
    };

    const handleUp = () => {
      setShowGrid(false);
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
  };

  // ✅ Apply crop
  const handleApply = () => {
    applyCrop(
      setDesignsByView,
      activePreview,
      design,
      cropBox,
      getBoundingBox,
      regionWidth,
      regionHeight,
    );
    setIsCropping(false);
    setActiveTab(design.text ? "editText" : "editDesign")
  };

  return (
    <div>
      {/* Container */}
      <div
        ref={containerRef}
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: design.originalAspectRatio,
          background: "#111",
          overflow: "hidden",
        }}
      >
        <img
          src={design.src}
          alt="crop"
          draggable="false"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "fill",
            userSelect: "none",
          }}
        />

        {/* Crop Box */}
        <div
          onMouseDown={startDrag}
          style={{
            position: "absolute",
            left: `${cropBox.x * 100}%`,
            top: `${cropBox.y * 100}%`,
            width: `${cropBox.width * 100}%`,
            height: `${cropBox.height * 100}%`,
            border: "2px solid #ccc",
            boxShadow: "0 0 0 9999px rgba(0,0,0,0.5)",
            cursor: "move",
          }}
        >
          {/* GRID */}
          {showGrid && (
            <div
              style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
            >
              <div style={gridVertical(33.33)} />
              <div style={gridVertical(66.66)} />
              <div style={gridHorizontal(33.33)} />
              <div style={gridHorizontal(66.66)} />
            </div>
          )}

          {/* EDGES */}
          <div
            onMouseDown={(e) => startResize("left", e)}
            style={edge("left")}
          />
          <div
            onMouseDown={(e) => startResize("right", e)}
            style={edge("right")}
          />
          <div onMouseDown={(e) => startResize("top", e)} style={edge("top")} />
          <div
            onMouseDown={(e) => startResize("bottom", e)}
            style={edge("bottom")}
          />

          {/* CORNERS */}
          <div onMouseDown={(e) => startResize("nw", e)} style={corner("nw")} />
          <div onMouseDown={(e) => startResize("ne", e)} style={corner("ne")} />
          <div onMouseDown={(e) => startResize("sw", e)} style={corner("sw")} />
          <div onMouseDown={(e) => startResize("se", e)} style={corner("se")} />
        </div>
      </div>

      {/* Actions */}
      <div className="crop-actions">
        <button
          className="crop-btn"
          onClick={() => {
            setCropBox({x:0, y:0, width:1, height:1});
          }}
        >
          Reset
        </button>

        <button className="crop-btn" onClick={handleApply}>
          Apply
        </button>
      </div>
    </div>
  );
}

/* -------- helpers -------- */

const edge = (pos) => ({
  position: "absolute",
  background: "transparent",
  ...(pos === "left" && {
    left: 0,
    top: 0,
    bottom: 0,
    width: "10px",
    cursor: "ew-resize",
  }),
  ...(pos === "right" && {
    right: 0,
    top: 0,
    bottom: 0,
    width: "10px",
    cursor: "ew-resize",
  }),
  ...(pos === "top" && {
    top: 0,
    left: 0,
    right: 0,
    height: "10px",
    cursor: "ns-resize",
  }),
  ...(pos === "bottom" && {
    bottom: 0,
    left: 0,
    right: 0,
    height: "10px",
    cursor: "ns-resize",
  }),
});

const corner = (pos) => ({
  position: "absolute",
  width: "12px",
  height: "12px",
  background: "#ccc",
  border: "2px solid #000",
  borderRadius: "50%",

  ...(pos === "nw" && { top: "-6px", left: "-6px", cursor: "nwse-resize" }),
  ...(pos === "ne" && { top: "-6px", right: "-6px", cursor: "nesw-resize" }),
  ...(pos === "sw" && { bottom: "-6px", left: "-6px", cursor: "nesw-resize" }),
  ...(pos === "se" && { bottom: "-6px", right: "-6px", cursor: "nwse-resize" }),
});

const gridVertical = (p) => ({
  position: "absolute",
  top: 0,
  bottom: 0,
  left: `${p}%`,
  width: "1.5px",
  background: "rgba(255,255,255,0.8)",
});

const gridHorizontal = (p) => ({
  position: "absolute",
  left: 0,
  right: 0,
  top: `${p}%`,
  height: "1.5px",
  background: "rgba(255,255,255,0.8)",
});
