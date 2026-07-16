import React, { useState, useEffect, useRef } from "react";
import { Rnd } from "react-rnd";
import {
  checkAfterRotation,
  handleToggleAspectLock,
  updateSizeClamped,
} from "../../../utils/designerUtils";

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
}) {
  const [lockedWrapperPos, setLockedWrapperPos] = useState(null);
  const [lockedDesignId, setLockedDesignId] = useState(null);
  const [keyboardMoving, setKeyboardMoving] = useState(false);

  const previewRef = useRef(null);

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

      setDesignsByView((prev) => ({
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
    setDesignsByView,
    getBoundingBox,
    setIsActive,
  ]);

  useEffect(() => {
    const arrowKeys = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"];

    const handleKeyDown = (e) => {
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
  }, []);

  return (
    <div
      className="preview-image-wrapper"
      ref={previewRef}
      style={{ position: "relative" }}
    >
      <img
        ref={imgRef}
        src={
          productOptions.find((opt) => opt.id === activeProduct?.productType)
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
          (opt) => opt.id === activeProduct?.productType,
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
          border: isActive || keyboardMoving ? "1.5px dashed #333" : "1.5px dashed transparent",
          backgroundColor: isActive ? "rgba(0,0,0,0.05)" : "transparent",
        };

        return (
          <div style={style}>
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
                        x: d.x * regionWidth,
                        y: d.y * regionHeight,
                      }
                }
                bounds="parent"
                // disableDragging={isRotating || isResizing}
                enableResizing={false}
                onDragStart={(e) => {
                  e.preventDefault();
                  setIsActive(true);
                  setIsWidthBlank(false);
                  setIsWidthZero(false);
                  setIsHeightBlank(false);
                  setIsHeightZero(false);
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
                  setPendingText(d?.text);
                }}
                onDrag={(e, data) => {
                  if (isRotating || isResizing) return;
                  let newX = data.x;
                  let newY = data.y;

                  // ✅ update state
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
                }}
              >
                {/* Outer wrapper */}
                <div
                  className={"design-container"}
                  onClick={(e) => {
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
                  }}
                  draggable="false"
                  style={{
                    width: getBoundingBox(
                      d.width * Math.min(regionWidth, regionHeight),
                      d.height * Math.min(regionWidth, regionHeight),
                      d.rotation,
                    ).width,
                    height: getBoundingBox(
                      d.width * Math.min(regionWidth, regionHeight),
                      d.height * Math.min(regionWidth, regionHeight),
                      d.rotation,
                    ).height,
                  }}
                >
                  {/* Inner design wrapper */}
                  <div
                    className="design-wrapper"
                    draggable="false"
                    style={{
                      width: d.width * Math.min(regionWidth, regionHeight),
                      height: d.height * Math.min(regionWidth, regionHeight),
                      transform: `rotate(${d.rotation}rad)
                                              scaleX(${d.horizontalFlip ? -1 : 1})
                                              scaleY(${d.verticalFlip ? -1 : 1})`,
                      transformOrigin: "center center",
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
            {designsByView[activePreview].map((d) => (
              <div
                className="bounding-box-overlay"
                style={{
                  left:
                    (isRotating || isResizing) &&
                    lockedWrapperPos &&
                    lockedDesignId === d.id
                      ? lockedWrapperPos.x
                      : d.x * regionWidth,
                  top:
                    (isRotating || isResizing) &&
                    lockedWrapperPos &&
                    lockedDesignId === d.id
                      ? lockedWrapperPos.y
                      : d.y * regionHeight,
                  width: getBoundingBox(
                    d.width * Math.min(regionWidth, regionHeight),
                    d.height * Math.min(regionWidth, regionHeight),
                    d.rotation,
                  ).width,
                  height: getBoundingBox(
                    d.width * Math.min(regionWidth, regionHeight),
                    d.height * Math.min(regionWidth, regionHeight),
                    d.rotation,
                  ).height,
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
                        setActiveTab("");
                        setDesignsByView((prev) => ({
                          ...prev,
                          [activePreview]: prev[activePreview].filter(
                            (item) => item.id !== d.id,
                          ),
                        }));
                        setSelectedDesignId(null);
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
                      }}
                      draggable="false"
                      onPointerDown={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        setIsRotating(true);
                        setLockedDesignId(d.id);
                        setLockedWrapperPos({
                          x: d.x * regionWidth,
                          y: d.y * regionHeight,
                        });

                        const rect = e.target.getBoundingClientRect();
                        const centerX = rect.left + rect.width / 2;
                        const centerY = rect.top + rect.height / 2;

                        const startAngle = Math.atan2(
                          e.clientY - centerY,
                          e.clientX - centerX,
                        );
                        const baseline = d.rotation || 0;

                        if (!d.isLocked_aspect_ratio) {
                          handleToggleAspectLock(
                            d,
                            activePreview,
                            setDesignsByView,
                            getBoundingBox,
                            regionWidth,
                            regionHeight,
                          );
                        }

                        const handleMove = (moveEvent) => {
                          const currentAngle = Math.atan2(
                            moveEvent.clientY - centerY,
                            moveEvent.clientX - centerX,
                          );
                          const delta = currentAngle - startAngle;

                          const newAngle = baseline + delta;

                          checkAfterRotation(
                            getBoundingBox,
                            d,
                            activePreview,
                            regionWidth,
                            regionHeight,
                            setDesignsByView,
                            newAngle,
                          );

                          setDesignsByView((prev) => ({
                            ...prev,
                            [activePreview]: prev[activePreview].map((item) =>
                              item.id === d.id
                                ? {
                                    ...item,
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
                        };

                        window.addEventListener("pointermove", handleMove);
                        window.addEventListener("pointerup", handleUp);
                      }}
                    >
                      <i className="bi bi-arrow-clockwise"></i>
                    </button>

                    <button
                      className="control-btn"
                      style={{
                        position: "absolute",
                        bottom: "-30px",
                        right: "-30px",
                        pointerEvents: "auto",
                      }}
                      onPointerDown={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        setIsResizing(true);
                        setLockedDesignId(d.id);
                        setLockedWrapperPos({
                          x: d.x * regionWidth,
                          y: d.y * regionHeight,
                        });

                        const startX = e.clientX;
                        const startY = e.clientY;
                        const startWidth = d.width * regionWidth;
                        const startHeight = d.height * regionHeight;
                        const aspectRatio = startWidth / startHeight;

                        const handleMove = (moveEvent) => {
                          const deltaX = moveEvent.clientX - startX;
                          const deltaY = moveEvent.clientY - startY;
                          let newWidth = Math.max(
                            0.05 * regionWidth,
                            startWidth + deltaX,
                          );
                          let newHeight = newWidth / aspectRatio;
                          if (!d.isLocked_aspect_ratio) {
                            newHeight = Math.max(
                              0.05 * regionHeight,
                              startHeight + deltaY,
                            );
                          } else if (newHeight < 0.05 * regionHeight) {
                            newHeight = 0.05 * regionHeight;
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
                          setJustFinishedInteraction(true);
                          setIsResizing(false);
                          setLockedWrapperPos(null);
                          setSelectedDesignId(d.id);

                          window.removeEventListener("pointermove", handleMove);
                          window.removeEventListener("pointerup", handleUp);
                        };

                        window.addEventListener("pointermove", handleMove);
                        window.addEventListener("pointerup", handleUp);
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
