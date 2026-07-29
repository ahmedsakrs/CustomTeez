import React, { useRef, useEffect } from "react";
import { radToDeg, rotate } from "../../../../utils/designerUtils";

function MobileRotationModal({
  barRef,
  selectedDesign,
  designsByView,
  setDesignsByView,
  updateDesignsByView,
  activePreview,
  getBoundingBox,
  regionWidth,
  regionHeight,
  setActiveTab,
}) {
  let angleDeg = Math.round(radToDeg(selectedDesign?.rotation || 0));

  const rotateIntervalRef = useRef(null);

  const updateAngle = (deg, check = false, updateHistory = true) => {
    const clamped = Math.max(-180, Math.min(180, deg));

    rotate(
      selectedDesign,
      updateHistory ? updateDesignsByView : setDesignsByView,
      activePreview,
      (clamped * Math.PI) / 180,
      regionWidth,
      regionHeight,
      getBoundingBox,
      check,
    );
  };

  const performStep = (step) => {
    setDesignsByView((prev) => ({
      ...prev,
      [activePreview]: prev[activePreview].map((item) => {
        if (item.id !== selectedDesign.id) {
          return item;
        }

        const currentDeg = Math.round(radToDeg(item.rotation || 0));

        const nextDeg = Math.max(-180, Math.min(180, currentDeg + step));

        return {
          ...item,
          rotation: (nextDeg * Math.PI) / 180,
        };
      }),
    }));
  };

  const startContinuousRotate = (step) => {
    updateDesignsByView(designsByView);

    performStep(step);

    rotateIntervalRef.current = setInterval(() => {
      performStep(step);
    }, 250);
  };

  const stopContinuousRotate = () => {
    if (rotateIntervalRef.current) {
      clearInterval(rotateIntervalRef.current);

      rotateIntervalRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      if (rotateIntervalRef.current) {
        clearInterval(rotateIntervalRef.current);
      }
    };
  }, []);

  return (
    <div
      className="mobile-upload-sheet"
      style={{ height: "150px", maxHeight: "150px", minHeight: "150px" }}
      ref={barRef}
    >
      <div className="mobile-product-tabbar" style={{ marginBottom: "3px" }}>
        <h2>{"Rotation"}</h2>

        <button
          className="close-btn"
          style={{ paddingTop: "0px", width: "25px", height: "25px" }}
          onClick={() => {
            setActiveTab(
              selectedDesign?.text
                ? "editText"
                : selectedDesign?.type === "upload"
                  ? "editUpload"
                  : "editDesign",
            );
          }}
        >
          <i class="fa fa-times" style={{ fontSize: "25px" }}></i>
        </button>
      </div>

      <div className="mobile-rotation-container">
        {/* Row 1 */}

        <div className="mobile-rotation-input-row">
          <button
            className="mobile-rotation-btn"
            onPointerDown={() => startContinuousRotate(-1)}
            onPointerUp={stopContinuousRotate}
            onPointerLeave={stopContinuousRotate}
            onPointerCancel={stopContinuousRotate}
          >
            −
          </button>

          <input
            type="number"
            className="mobile-rotation-input"
            value={Math.round(radToDeg(selectedDesign?.rotation))}
            min={-180}
            max={180}
            onChange={(e) => {
              const val = e.target.value === "" ? 0 : parseInt(e.target.value);
              updateAngle(val, true, true);
            }}
          />

          <button
            className="mobile-rotation-btn"
            onPointerDown={() => startContinuousRotate(1)}
            onPointerUp={stopContinuousRotate}
            onPointerLeave={stopContinuousRotate}
            onPointerCancel={stopContinuousRotate}
          >
            +
          </button>
        </div>

        {/* Row 2 */}

        <input
          type="range"
          min="-180"
          max="180"
          value={angleDeg}
          className="slider"
          style={{ maxWidth: "100%", width: "100%" }}
          onPointerDown={() => updateDesignsByView(designsByView)}
          onChange={(e) => {
            updateAngle(parseInt(e.target.value), false, false);
          }}
          onPointerUp={() => {
            updateAngle(angleDeg, true, false);
          }}
        />
      </div>
    </div>
  );
}

export default MobileRotationModal;
