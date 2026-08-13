import React, { useState, useEffect, useRef, useCallback } from "react";
import { Rnd } from "react-rnd";
import {
  getRotationAdjustedValues,
  handleToggleAspectLock,
  updateSizeClamped,
  addDesignCollageToActiveView,
  sendToBack,
  bringToFront,
  center,
} from "../../../utils/designerUtils";
import HorizontalLine from "../../HorizontalLine";

function ActivePreview({
  imgRef,
  productOptions,
  regionWidth,
  regionHeight,
  setRegionWidth,
  setRegionHeight,
  activeProduct,
  designsByView,
  setDesignsByView,
  activePreview,
  isRotating,
  isResizing,
  setIsActive,
  setIsWidthBlank,
  setIsWidthZero,
  setIsHeightBlank,
  setIsHeightZero,
  setSelectedDesignId,
  setActiveTab,
  setPendingText,
  getBoundingBox,
  setJustFinishedInteraction,
  isActive,
  selectedDesignId,
  setIsRotating,
  setIsResizing,
  updateDesignsByView,
  contextMenu,
  setContextMenu,
  isMobile,
}) {
  const [lockedWrapperPos, setLockedWrapperPos] = useState(null);
  const [lockedDesignId, setLockedDesignId] = useState(null);
  const [keyboardMoving, setKeyboardMoving] = useState(false);
  const [menuPosition, setMenuPosition] = useState(null);

  const previewRef = useRef(null);
  const contextMenuRef = useRef(null);
  const dragStartPosRef = useRef(null);
  const dragMovedRef = useRef(false);
  const dragHistorySavedRef = useRef(false);
  const copiedCollageRef = useRef(null);
  const touchHoldTimerRef = useRef(null);


  useEffect(() => {
    if (!previewRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        setRegionWidth(width);
        setRegionHeight(height);
      }
    });

    observer.observe(previewRef.current);
    return () => observer.disconnect();
  }, [setRegionWidth, setRegionHeight]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selectedDesignId || isRotating || isResizing) {
        return;
      }

      const target = e.target;

      const isTyping =
        target instanceof HTMLElement &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);

      if (isTyping) {
        return;
      }

      const STEP_PX = e.shiftKey ? 10 : 1;

      let dx = 0;
      let dy = 0;

      switch (e.key) {
        case "ArrowLeft":
          dx = -STEP_PX / regionWidth;
          break;

        case "ArrowRight":
          dx = STEP_PX / regionWidth;
          break;

        case "ArrowUp":
          dy = -STEP_PX / regionHeight;
          break;

        case "ArrowDown":
          dy = STEP_PX / regionHeight;
          break;

        default:
          return;
      }

      e.preventDefault();

      updateDesignsByView((prev) => ({
        ...prev,
        [activePreview]: prev[activePreview].map((item) => {
          if (item.id !== selectedDesignId) {
            return item;
          }

          const bbox = getBoundingBox(
            item.width * Math.min(regionWidth, regionHeight),
            item.height * Math.min(regionWidth, regionHeight),
            item.rotation,
          );

          const bboxWidthNorm = bbox.width / regionWidth;

          const bboxHeightNorm = bbox.height / regionHeight;

          const newX = Math.min(Math.max(0, item.x + dx), 1 - bboxWidthNorm);

          const newY = Math.min(Math.max(0, item.y + dy), 1 - bboxHeightNorm);

          return {
            ...item,
            x: newX,
            y: newY,
          };
        }),
      }));
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    selectedDesignId,
    activePreview,
    regionWidth,
    regionHeight,
    isRotating,
    isResizing,
    updateDesignsByView,
    getBoundingBox,
    setIsActive,
  ]);

  useEffect(() => {
    const arrowKeys = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"];

    const handleKeyDown = (e) => {
      const target = e.target;

      const isTyping =
        target instanceof HTMLElement &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);

      if (isTyping) {
        return;
      }

      if (!selectedDesignId || isRotating || isResizing) {
        return;
      }

      if (arrowKeys.includes(e.key)) {
        setKeyboardMoving(true);
      }
    };

    const handleKeyUp = (e) => {
      if (arrowKeys.includes(e.key)) {
        setKeyboardMoving(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);

      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [isResizing, isRotating, selectedDesignId]);

  const copyDesign = useCallback(
    (designID, copied = true) => {
      const design = designsByView[activePreview].find(
        (d) => d.id === designID,
      );
      copiedCollageRef.current = {
        designs: [
          {
            ...design,
          },
        ],
        operation: copied ? "copy" : "cut",
      };
    },
    [designsByView, activePreview],
  );

  const deleteDesign = useCallback(
    (designID) => {
      updateDesignsByView((prev) => ({
        ...prev,
        [activePreview]: prev[activePreview].filter(
          (item) => item.id !== designID,
        ),
      }));
      setSelectedDesignId(null);
      setActiveTab(null);
    },
    [updateDesignsByView, activePreview, setSelectedDesignId, setActiveTab],
  );

  const cutDesign = useCallback(
    (designID) => {
      copyDesign(designID, false);
      deleteDesign(designID);
    },
    [copyDesign, deleteDesign],
  );

  const pasteDesign = useCallback(() => {
    if (!copiedCollageRef.current) {
      return;
    }

    const offsetX = 10 / regionWidth;

    const offsetY = 10 / regionHeight;

    const collage = {
      designs: copiedCollageRef.current.designs.map((d) => ({
        ...d,

        // offset from original
        x: d.x + offsetX,
        y: d.y + offsetY,
      })),
    };

    addDesignCollageToActiveView(
      collage,
      imgRef,
      setSelectedDesignId,
      updateDesignsByView,
      activePreview,
    );

    if (copiedCollageRef.current.operation === "cut") {
      copiedCollageRef.current = null;
    }
  }, [
    copiedCollageRef,
    imgRef,
    setSelectedDesignId,
    updateDesignsByView,
    activePreview,
    regionWidth,
    regionHeight,
  ]);

  useEffect(() => {
    const closeMenu = () => setContextMenu(null);

    window.addEventListener("click", closeMenu);

    return () => window.removeEventListener("click", closeMenu);
  }, [setContextMenu]);

  const selectedDesign = designsByView[activePreview].find(
    (d) => d.id === selectedDesignId,
  );

  useEffect(() => {
    const handleKeyDown = (e) => {
      const target = e.target;

      const isTyping =
        target instanceof HTMLElement &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);

      if (isTyping) {
        return;
      }
      const ctrl = e.ctrlKey || e.metaKey;

      const selectedDesign = designsByView[activePreview]?.find(
        (d) => d.id === selectedDesignId,
      );

      if (!selectedDesign && e.key !== "v" && e.key !== "V") {
        return;
      }

      // Copy
      if (ctrl && e.key.toLowerCase() === "c") {
        e.preventDefault();

        copyDesign(selectedDesign.id);

        return;
      }

      // Cut
      if (ctrl && e.key.toLowerCase() === "x") {
        e.preventDefault();

        cutDesign(selectedDesign.id);

        return;
      }

      // Paste
      if (ctrl && e.key.toLowerCase() === "v") {
        if (!copiedCollageRef.current) return;
        e.preventDefault();

        pasteDesign();

        if (selectedDesign?.text) {
          // ✅ it's a text image
          setActiveTab("editText");
        } else if (selectedDesign?.type !== "upload") {
          // ✅ it's a normal design image
          setActiveTab("editDesign");
        } else {
          setActiveTab("editUpload");
        }

        return;
      }

      // Delete
      if (e.key === "Delete" || e.key === "Backspace") {
        e.preventDefault();

        deleteDesign(selectedDesign.id);

        return;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    activePreview,
    selectedDesignId,
    designsByView,
    cutDesign,
    copyDesign,
    deleteDesign,
    pasteDesign,
    setActiveTab,
  ]);

  useEffect(() => {
    if (!contextMenu || !previewRef.current || !contextMenuRef.current) {
      return;
    }

    const menuDesign = designsByView[activePreview].find(
      (d) => d.id === contextMenu.designId,
    );

    if (!menuDesign) {
      return;
    }

    const bbox = getBoundingBox(
      menuDesign.width * Math.min(regionWidth, regionHeight),
      menuDesign.height * Math.min(regionWidth, regionHeight),
      menuDesign.rotation,
    );

    const wrapperRect = previewRef.current.getBoundingClientRect();

    const menuRect = contextMenuRef.current.getBoundingClientRect();

    let left = menuDesign.x * regionWidth + bbox.width / 2;

    let top = menuDesign.y * regionHeight + bbox.height + 10;

    // keep inside right edge
    if (left + menuRect.width / 2 > wrapperRect.width) {
      left = wrapperRect.width - menuRect.width / 2 - 8;
    }

    // keep inside left edge
    if (left - menuRect.width / 2 < 0) {
      left = menuRect.width / 2 + 8;
    }

    const reservedBottomSpace = isMobile ? 200 : 120;

    const availableBottom = wrapperRect.height - reservedBottomSpace;

    // if it hits navbar, move above design
    if (top + menuRect.height > availableBottom) {
      top = menuDesign.y * regionHeight - menuRect.height - 10;
    }

    // still doesn't fit
    if (top + menuRect.height > availableBottom) {
      top = availableBottom - menuRect.height - 8;
    }

    // prevent top overflow
    if (top < 8) {
      top = 8;
    }

    // top overflow
    if (top < 0) {
      top = 8;
    }

    setMenuPosition({
      left,
      top,
    });
  }, [
    contextMenu,
    activePreview,
    designsByView,
    regionWidth,
    regionHeight,
    getBoundingBox,
    isMobile,
  ]);
  return (
    <div
      className={
        !isMobile ? "preview-image-wrapper" : "mobile-preview-image-wrapper"
      }
      ref={previewRef}
      style={{ position: "relative" }}
    >
      <img
        ref={imgRef}
        src={
          productOptions.find((opt) => opt._id === activeProduct?.productType)
            ?.viewImages[activeProduct?.color][activePreview]
        }
        alt={`${activeProduct?.name} ${activePreview}`}
        className="preview-image"
        style={{ display: "block" }}
        draggable="false"
      />

      {/* Region overlay aligned to the image */}
      {(() => {
        const product = productOptions.find(
          (opt) => opt._id === activeProduct?.productType,
        );
        const region = product?.viewRegions[activePreview];
        if (!imgRef.current || !region) return null;

        const w = imgRef.current.offsetWidth;
        const h = imgRef.current.offsetHeight;
        const r_w = (region.xEnd - region.xStart) * w;
        const r_h = (region.yEnd - region.yStart) * h;
        if (r_w !== regionWidth) setRegionWidth(r_w);
        if (r_h !== regionHeight) setRegionHeight(r_h);

        const style = {
          position: "absolute",
          left: imgRef.current.offsetLeft + region.xStart * w,
          top: imgRef.current.offsetTop + region.yStart * h,
          width: regionWidth,
          height: regionHeight,
          border:
            isActive || keyboardMoving
              ? "1.5px dashed #333"
              : "1.5px dashed transparent",
          backgroundColor: isActive ? "rgba(0,0,0,0.05)" : "transparent",
        };

        return (
          <div
            style={style}
            onContextMenu={(e) => {
              e.preventDefault();
              if (e.target === e.currentTarget) {
                setSelectedDesignId(null);

                setContextMenu({
                  type: "preview",
                  x: e.clientX,
                  y: e.clientY,
                });
              }
            }}
          >
            {designsByView[activePreview].map((d) => (
              <Rnd
                key={d.id}
                enableUserSelectHack={false}
                style={{
                  cursor: isRotating || isResizing ? "default" : "grab",
                  zIndex: d.layer,
                }}
                size={getBoundingBox(
                  d.width * Math.min(regionWidth, regionHeight),
                  d.height * Math.min(regionWidth, regionHeight),
                  d.rotation,
                )}
                position={
                  (isRotating || isResizing) &&
                  lockedWrapperPos &&
                  lockedDesignId === d.id
                    ? lockedWrapperPos
                    : {
                        x: Math.round(d.x * regionWidth),
                        y: Math.round(d.y * regionHeight),
                      }
                }
                bounds="parent"
                // disableDragging={isRotating || isResizing}
                enableResizing={false}
                onDragStart={(e) => {
                  e.preventDefault();
                  setContextMenu(null);
                  setIsActive(true);
                  setIsWidthBlank(false);
                  setIsWidthZero(false);
                  setIsHeightBlank(false);
                  setIsHeightZero(false);
                  setSelectedDesignId(d.id);
                  dragMovedRef.current = false;
                  dragHistorySavedRef.current = false;
                  dragStartPosRef.current = {
                    x: d.x,
                    y: d.y,
                  };
                  if (d.text) {
                    // ✅ it's a text image
                    setActiveTab("editText");
                  } else if (d.type !== "upload") {
                    // ✅ it's a normal design image
                    setActiveTab("editDesign");
                  } else {
                    setActiveTab("editUpload");
                  }
                  setPendingText(d?.text);
                  // updateDesignsByView(designsByView);
                }}
                onDrag={(e, data) => {
                  if (isRotating || isResizing) return;

                  // Save PRE-DRAG state exactly once
                  if (!dragHistorySavedRef.current) {
                    updateDesignsByView(designsByView); // save current state BEFORE editing
                    dragHistorySavedRef.current = true;
                  }

                  const newX = data.x;
                  const newY = data.y;

                  setDesignsByView((prev) => ({
                    ...prev,
                    [activePreview]: prev[activePreview].map((item) =>
                      item.id === d.id
                        ? {
                            ...item,
                            x: newX / regionWidth,
                            y: newY / regionHeight,
                          }
                        : item,
                    ),
                  }));
                }}
                onDragStop={() => {
                  setIsActive(false);
                  setSelectedDesignId(d.id);

                  dragHistorySavedRef.current = false;
                }}
              >
                {/* Outer wrapper */}
                <div
                  className={"design-container"}
                  onClick={(e) => {
                    e.stopPropagation();
                    setContextMenu(null);
                    setSelectedDesignId(d.id);
                    if (d.text) {
                      // ✅ it's a text image
                      setActiveTab("editText");
                    } else if (d.type !== "upload") {
                      // ✅ it's a normal design image
                      setActiveTab("editDesign");
                    } else {
                      setActiveTab("editUpload");
                    }
                  }}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedDesignId(d.id);
                    if (d.text) {
                      // ✅ it's a text image
                      setActiveTab("editText");
                    } else if (d.type !== "upload") {
                      // ✅ it's a normal design image
                      setActiveTab("editDesign");
                    } else {
                      setActiveTab("editUpload");
                    }
                    setContextMenu({
                      type: "design",
                      designId: d.id,
                    });
                  }}
                  onTouchStart={(e) => {
                    touchHoldTimerRef.current = setTimeout(() => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSelectedDesignId(d.id);
                      if (d.text) {
                        // ✅ it's a text image
                        setActiveTab("editText");
                      } else if (d.type !== "upload") {
                        // ✅ it's a normal design image
                        setActiveTab("editDesign");
                      } else {
                        setActiveTab("editUpload");
                      }

                      setContextMenu({
                        type: "design",
                        designId: d.id,
                      });
                    }, 600);
                  }}
                  onTouchEnd={() => {
                    clearTimeout(touchHoldTimerRef.current);
                  }}
                  onTouchMove={() => {
                    clearTimeout(touchHoldTimerRef.current);
                  }}
                  draggable="false"
                  style={{
                    width: Math.round(getBoundingBox(
                      d.width * Math.min(regionWidth, regionHeight),
                      d.height * Math.min(regionWidth, regionHeight),
                      d.rotation,
                    ).width),
                    height: Math.round(getBoundingBox(
                      d.width * Math.min(regionWidth, regionHeight),
                      d.height * Math.min(regionWidth, regionHeight),
                      d.rotation,
                    ).height),
                  }}
                >
                  {/* Inner design wrapper */}
                  <div
                    className="design-wrapper"
                    draggable="false"
                    style={{
                      width: Math.round(d.width * Math.min(regionWidth, regionHeight)),
                      height: Math.round(d.height * Math.min(regionWidth, regionHeight)),
                      transform: `rotate(${d.rotation}rad)
                                              scaleX(${d.horizontalFlip ? -1 : 1})
                                              scaleY(${d.verticalFlip ? -1 : 1})`,
                      // transformOrigin: "center center",
                    }}
                  >
                    <img
                      src={d.croppedSrc || d.src}
                      alt={d.name}
                      className="design-preview-image"
                      draggable="false"
                      style={{
                        width: "100%",
                        height: "100%",
                      }}
                    />
                  </div>
                </div>
              </Rnd>
            ))}

            {contextMenu &&
              (() => {
                const menuDesign =
                  contextMenu.type === "design"
                    ? designsByView[activePreview].find(
                        (item) => item.id === contextMenu.designId,
                      )
                    : null;

                if (contextMenu.type === "design" && !menuDesign) {
                  return null;
                }

                return (
                  <div
                    className="designer-context-menu"
                    ref={contextMenuRef}
                    // style={{
                    //   left:
                    //     contextMenu.type === "preview"
                    //       ? contextMenu.x
                    //       : menuDesign.x * regionWidth + bbox.width / 2,
                    //   top:
                    //     contextMenu.type === "preview"
                    //       ? contextMenu.y
                    //       : menuDesign.y * regionHeight + bbox.height / 2,
                    //   position:
                    //     contextMenu.type === "preview" ? "fixed" : "absolute",
                    // }}

                    style={{
                      left: menuPosition?.left ?? 0,

                      top: menuPosition?.top ?? 0,

                      transform: "translateX(-50%)",
                    }}
                  >
                    {contextMenu.type === "design" && (
                      <>
                        <button
                          onClick={(e) => {
                            center(
                              selectedDesignId,
                              updateDesignsByView,
                              activePreview,
                              getBoundingBox,
                              regionWidth,
                              regionHeight,
                            );
                            setContextMenu(null);
                          }}
                        >
                          Center
                        </button>
                        <HorizontalLine
                          lineColor={"#555"}
                          marginUp={0}
                          marginDown={0}
                        />

                        <button
                          onClick={(e) => {
                            bringToFront(
                              activePreview,
                              selectedDesignId,
                              updateDesignsByView,
                            );
                            setContextMenu(null);
                          }}
                        >
                          Bring To Front
                        </button>
                        <button
                          onClick={(e) => {
                            sendToBack(
                              activePreview,
                              selectedDesignId,
                              updateDesignsByView,
                            );
                            setContextMenu(null);
                          }}
                        >
                          Send To Back
                        </button>
                        <HorizontalLine
                          lineColor={"#555"}
                          marginUp={0}
                          marginDown={0}
                        />
                        {!selectedDesign?.text && (
                          <div>
                            <button
                              onClick={(e) => {
                                setActiveTab("Crop");
                                setContextMenu(null);
                              }}
                            >
                              Crop
                            </button>
                            <HorizontalLine
                              lineColor={"#555"}
                              marginUp={0}
                              marginDown={0}
                            />
                          </div>
                        )}
                        <button
                          onClick={() => {
                            copyDesign(contextMenu.designId);
                            setContextMenu(null);
                          }}
                        >
                          Copy
                        </button>

                        <button
                          onClick={() => {
                            cutDesign(contextMenu.designId);
                            setContextMenu(null);
                          }}
                        >
                          Cut
                        </button>

                        <button
                          onClick={() => {
                            pasteDesign();
                            setContextMenu(null);

                            if (selectedDesign?.text) {
                              // ✅ it's a text image
                              setActiveTab("editText");
                            } else if (selectedDesign?.type !== "upload") {
                              // ✅ it's a normal design image
                              setActiveTab("editDesign");
                            } else {
                              setActiveTab("editUpload");
                            }
                          }}
                          disabled={!copiedCollageRef.current}
                        >
                          Paste
                        </button>

                        <HorizontalLine
                          lineColor={"#555"}
                          marginUp={0}
                          marginDown={0}
                        />

                        <button
                          onClick={() => {
                            deleteDesign(contextMenu.designId);
                            setContextMenu(null);
                          }}
                        >
                          Delete
                        </button>
                      </>
                    )}

                    {contextMenu.type === "preview" && (
                      <button
                        onClick={() => {
                          pasteDesign();
                          setContextMenu(null);

                          const d = designsByView[activePreview].find(
                            (d) => d.id === selectedDesignId,
                          );

                          if (d?.text) {
                            // ✅ it's a text image
                            setActiveTab("editText");
                          } else if (d?.type !== "upload") {
                            // ✅ it's a normal design image
                            setActiveTab("editDesign");
                          } else {
                            setActiveTab("editUpload");
                          }
                        }}
                        disabled={!copiedCollageRef.current}
                      >
                        Paste
                      </button>
                    )}
                  </div>
                );
              })()}
            {designsByView[activePreview].map((d) => (
              <div
                className="bounding-box-overlay"
                style={{
                  left:
                    (isRotating || isResizing) &&
                    lockedWrapperPos &&
                    lockedDesignId === d.id
                      ? lockedWrapperPos.x - 3
                      : Math.round(d.x * regionWidth - 3),
                  top:
                    (isRotating || isResizing) &&
                    lockedWrapperPos &&
                    lockedDesignId === d.id
                      ? lockedWrapperPos.y - 3
                      : Math.round(d.y * regionHeight - 3),
                  width: Math.round(getBoundingBox(
                    d.width * Math.min(regionWidth, regionHeight),
                    d.height * Math.min(regionWidth, regionHeight),
                    d.rotation,
                  ).width + 4),
                  height: Math.round(getBoundingBox(
                    d.width * Math.min(regionWidth, regionHeight),
                    d.height * Math.min(regionWidth, regionHeight),
                    d.rotation,
                  ).height + 4),
                  zIndex: selectedDesignId === d.id ? 9999 : d.layer,
                  border:
                    selectedDesignId === d.id
                      ? "2px solid rgba(0,0,0,0.2)"
                      : "none",
                  backgroundColor:
                    selectedDesignId === d.id
                      ? "rgba(255,255,255,0.05)"
                      : "transparent",
                  pointerEvents: "none",
                }}
              >
                {selectedDesignId === d.id && (
                  <>
                    <button
                      draggable="false"
                      className="control-btn"
                      style={{
                        position: "absolute",
                        top: "-30px",
                        right: "-30px",
                        pointerEvents: "auto",
                      }}
                      onMouseDown={(e) => e.stopPropagation()}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveTab(null);
                        deleteDesign(d.id);
                      }}
                    >
                      <i class="bi bi-x" style={{ fontSize: "24px" }}></i>
                    </button>

                    <button
                      className="control-btn"
                      style={{
                        position: "absolute",
                        top: "-30px",
                        left: "-30px",
                        pointerEvents: "auto",
                        touchAction: "none",
                      }}
                      draggable="false"
                      onPointerDown={(e) => {
                        setActiveTab(
                          selectedDesign.text
                            ? "editText"
                            : selectedDesign.type === "upload"
                              ? "editUpload"
                              : "editDesign",
                        );
                        e.stopPropagation();
                        e.preventDefault();
                        setIsRotating(true);
                        setLockedDesignId(d.id);
                        setLockedWrapperPos({
                          x: d.x * regionWidth,
                          y: d.y * regionHeight,
                        });

                        if (!d.isLocked_aspect_ratio) {
                          handleToggleAspectLock(
                            d,
                            activePreview,
                            updateDesignsByView,
                            getBoundingBox,
                            regionWidth,
                            regionHeight,
                          );
                        } else {
                          updateDesignsByView(designsByView);
                        }

                        const rect = e.target.getBoundingClientRect();
                        const centerX = rect.left + rect.width / 2;
                        const centerY = rect.top + rect.height / 2;

                        const startAngle = Math.atan2(
                          e.clientY - centerY,
                          e.clientX - centerX,
                        );
                        const baseline = d.rotation || 0;

                        const handleMove = (moveEvent) => {
                          const currentAngle = Math.atan2(
                            moveEvent.clientY - centerY,
                            moveEvent.clientX - centerX,
                          );
                          const delta = currentAngle - startAngle;

                          const newAngle = baseline + delta;

                          const adjusted = getRotationAdjustedValues(
                            getBoundingBox,
                            d,
                            regionWidth,
                            regionHeight,
                            newAngle,
                          );

                          setDesignsByView((prev) => ({
                            ...prev,
                            [activePreview]: prev[activePreview].map((item) =>
                              item.id === d.id
                                ? {
                                    ...item,
                                    ...adjusted,
                                    rotation: newAngle,
                                  }
                                : item,
                            ),
                          }));
                          setJustFinishedInteraction(true);
                        };

                        const handleUp = () => {
                          setIsWidthBlank(false);
                          setIsWidthZero(false);
                          setIsHeightBlank(false);
                          setIsHeightZero(false);
                          setSelectedDesignId(d.id);
                          setJustFinishedInteraction(true);
                          setIsRotating(false);
                          setLockedWrapperPos(null);

                          window.removeEventListener("pointermove", handleMove);
                          window.removeEventListener("pointerup", handleUp);
                          window.removeEventListener("pointercancel", handleUp);
                        };

                        window.addEventListener("pointermove", handleMove);
                        window.addEventListener("pointerup", handleUp);
                        window.addEventListener("pointercancel", handleUp);
                      }}
                    >
                      <i className="bi bi-arrow-clockwise"></i>
                    </button>

                    <button
                      draggable="false"
                      className="control-btn"
                      style={{
                        position: "absolute",
                        bottom: "-30px",
                        right: "-30px",
                        pointerEvents: "auto",
                        touchAction: "none",
                      }}
                      onPointerDown={(e) => {
                        setActiveTab(
                          selectedDesign.text
                            ? "editText"
                            : selectedDesign.type === "upload"
                              ? "editUpload"
                              : "editDesign",
                        );
                        e.stopPropagation();
                        // e.preventDefault();
                        setIsResizing(true);
                        setLockedDesignId(d.id);
                        setLockedWrapperPos({
                          x: d.x * regionWidth,
                          y: d.y * regionHeight,
                        });
                        updateDesignsByView(designsByView);

                        const startX = e.clientX;
                        const startY = e.clientY;
                        const startWidth = d.width * regionWidth;
                        const startHeight = d.height * regionHeight;
                        const aspectRatio = startWidth / startHeight;

                        const handleMove = (moveEvent) => {
                          const deltaX = moveEvent.clientX - startX;
                          const deltaY = moveEvent.clientY - startY;
                          let newWidth = Math.max(
                            0.15 * regionWidth,
                            startWidth + deltaX,
                          );
                          let newHeight = newWidth / aspectRatio;
                          if (!d.isLocked_aspect_ratio) {
                            newHeight = Math.max(
                              0.15 * regionHeight,
                              startHeight + deltaY,
                            );
                          } else if (newHeight < 0.15 * regionHeight) {
                            newHeight = 0.15 * regionHeight;
                            newWidth = newHeight * aspectRatio;
                          }

                          updateSizeClamped(
                            d.id,
                            newWidth / regionWidth,
                            newHeight / regionHeight,
                            setDesignsByView,
                            activePreview,
                            getBoundingBox,
                            regionWidth,
                            regionHeight,
                          );
                          setJustFinishedInteraction(true);
                        };

                        const handleUp = () => {
                          setIsWidthBlank(false);
                          setIsWidthZero(false);
                          setIsHeightBlank(false);
                          setIsHeightZero(false);
                          setJustFinishedInteraction(false);
                          setIsResizing(false);
                          setLockedWrapperPos(null);
                          setSelectedDesignId(d.id);

                          window.removeEventListener("pointermove", handleMove);
                          window.removeEventListener("pointerup", handleUp);
                          window.removeEventListener("pointercancel", handleUp);
                        };

                        window.addEventListener("pointermove", handleMove);
                        window.addEventListener("pointerup", handleUp);
                        window.addEventListener("pointercancel", handleUp);
                      }}
                    >
                      <i
                        className="bi bi-arrows-angle-expand"
                        style={{ transform: "scaleX(-1)" }}
                      ></i>
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
        );
      })()}
    </div>
  );
}

export default ActivePreview;
