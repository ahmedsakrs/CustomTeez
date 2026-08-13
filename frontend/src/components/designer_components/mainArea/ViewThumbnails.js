import React, { useState, useRef, useEffect } from "react";

function ViewThumbnails({
  activePreview,
  setActivePreview,
  productOptions,
  activeProduct,
  getBoundingBox,
  designsByView,
}) {
  const [thumbSizes, setThumbSizes] = useState({
    Front: { w: 0, h: 0 },
    Back: { w: 0, h: 0 },
    "L Sleeve": { w: 0, h: 0 },
    "R Sleeve": { w: 0, h: 0 },
  });

  const thumbRefs = {
    Front: useRef(null),
    Back: useRef(null),
    "L Sleeve": useRef(null),
    "R Sleeve": useRef(null),
  };
  useEffect(() => {
    const observers = {};

    Object.keys(thumbRefs).forEach((view) => {
      if (thumbRefs[view].current) {
        observers[view] = new ResizeObserver((entries) => {
          for (let entry of entries) {
            const { width, height } = entry.contentRect;
            setThumbSizes((prev) => ({
              ...prev,
              [view]: { w: width, h: height },
            }));
          }
        });
        observers[view].observe(thumbRefs[view].current);
      }
    });

    return () => {
      Object.values(observers).forEach((observer) => observer.disconnect());
    };
  });

  const getThumbRegionSize = (view) => {
    let width =
      (productOptions.find((opt) => opt._id === activeProduct?.productType)
        ?.viewRegions[view].xEnd -
        productOptions.find((opt) => opt._id === activeProduct?.productType)
          ?.viewRegions[view].xStart) *
      thumbSizes[view].w;
    let height =
      (productOptions.find((opt) => opt._id === activeProduct?.productType)
        ?.viewRegions[view].yEnd -
        productOptions.find((opt) => opt._id === activeProduct?.productType)
          ?.viewRegions[view].yStart) *
      thumbSizes[view].h;
    return { w: width, h: height };
  };
  return (
    <div className="view-thumbnails">
      {["Front", "Back", "L Sleeve", "R Sleeve"].map((view) => (
        <div
          key={view}
          className={`view-thumbnail ${activePreview === view ? "active" : ""}`}
          onClick={() => setActivePreview(view)}
        >
          {view !== activePreview && (
            <div>
          <img
            src={
              productOptions.find(
                (opt) => opt._id === activeProduct?.productType,
              )?.viewImages[activeProduct?.color][view]
            }
            alt={`${view} preview`}
            className="preview-image"
            draggable="false"
            ref={thumbRefs[view]}
          />
          <div
            className="design-region"
            style={{
              position: "absolute",
              left:
                productOptions.find(
                  (opt) => opt._id === activeProduct?.productType,
                )?.viewRegions[view].xStart * thumbSizes[view].w,
              top:
                productOptions.find(
                  (opt) => opt._id === activeProduct?.productType,
                )?.viewRegions[view].yStart * thumbSizes[view].h,
              width: getThumbRegionSize(view).w,
              height: getThumbRegionSize(view).h,
            }}
          >
            {designsByView[view]?.map((design) => (
              <div
                style={{
                  position: "absolute",
                  left: design.x * getThumbRegionSize(view).w,
                  top: design.y * getThumbRegionSize(view).h,
                  width: getBoundingBox(
                    design.width *
                      Math.min(
                        getThumbRegionSize(view).w,
                        getThumbRegionSize(view).h,
                      ),
                    design.height *
                      Math.min(
                        getThumbRegionSize(view).w,
                        getThumbRegionSize(view).h,
                      ),
                    design.rotation,
                  ).width,
                  height: getBoundingBox(
                    design.width *
                      Math.min(
                        getThumbRegionSize(view).w,
                        getThumbRegionSize(view).h,
                      ),
                    design.height *
                      Math.min(
                        getThumbRegionSize(view).w,
                        getThumbRegionSize(view).h,
                      ),
                    design.rotation,
                  ).height,
                  zIndex: design.layer,
                }}
              >
                <div
                  className={"design-container"}
                  style={{
                    width: getBoundingBox(
                      design.width *
                        Math.min(
                          getThumbRegionSize(view).w,
                          getThumbRegionSize(view).h,
                        ),
                      design.height *
                        Math.min(
                          getThumbRegionSize(view).w,
                          getThumbRegionSize(view).h,
                        ),
                      design.rotation,
                    ).width,
                    height: getBoundingBox(
                      design.width *
                        Math.min(
                          getThumbRegionSize(view).w,
                          getThumbRegionSize(view).h,
                        ),
                      design.height *
                        Math.min(
                          getThumbRegionSize(view).w,
                          getThumbRegionSize(view).h,
                        ),
                      design.rotation,
                    ).height,
                  }}
                >
                  <div
                    className="design-wrapper"
                    style={{
                      width:
                        design.width *
                        Math.min(
                          getThumbRegionSize(view).w,
                          getThumbRegionSize(view).h,
                        ),
                      height:
                        design.height *
                        Math.min(
                          getThumbRegionSize(view).w,
                          getThumbRegionSize(view).h,
                        ),
                      transform: `rotate(${design.rotation}rad)
                                          scaleX(${design.horizontalFlip ? -1 : 1})
                                          scaleY(${design.verticalFlip ? -1 : 1})`,
                      transformOrigin: "center center",
                    }}
                  >
                    <img
                      key={design.id}
                      src={design.croppedSrc || design.src}
                      alt=""
                      className="design-preview-image"
                      draggable="false"
                      style={{
                        height: "100%",
                        width: "100%",
                        position: "absolute",
                        top: 0,
                        left: 0,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="option-name">{view}</div>
          </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default ViewThumbnails;
