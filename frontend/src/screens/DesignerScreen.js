import React, { useState, useRef, useEffect } from "react";
import { Rnd } from "react-rnd";
import "./ProductDesigner.css"; // responsive styles
import Sidebar from "../components/designer_components/sidebar/Sidebar";

const productOptions = [
  {
    id: "tshirt",
    name: "T-Shirt",
    productColors: ["Red", "Blue"],
    viewImages: {
      Red: {
        Front: "/images/tshirt/red_front.png",
        Back: "/images/tshirt/red_back.png",
        "L Sleeve": "/images/tshirt/red_left.png",
        "R Sleeve": "/images/tshirt/red_left.png",
      },
      Blue: {
        Front: "/images/tshirt/blue_front.png",
        Back: "/images/tshirt/blue_back.png",
        "L Sleeve": "/images/tshirt/blue_left.png",
        "R Sleeve": "/images/tshirt/blue_right.png",
      },
    },
    viewRegions: {
      Front: { xStart: 0, yStart: 0, xEnd: 1, yEnd: 1 },
      Back: { xStart: 0.1, yStart: 0.4, xEnd: 0.8, yEnd: 1 },
      "L Sleeve": { xStart: 0.1, yStart: 0.2, xEnd: 0.9, yEnd: 0.8 },
      "R Sleeve": { xStart: 0.1, yStart: 0.2, xEnd: 0.9, yEnd: 0.8 },
    },
  },
  {
    id: "hoodie",
    name: "Hoodie",
    productColors: ["Black", "Gray"],
    viewImages: {
      Black: {
        Front: "/images/hoodie/black_front.png",
        Back: "/images/hoodie/black_back.png",
        "L Sleeve": "/images/hoodie/black_left.png",
        "R Sleeve": "/images/hoodie/black_right.png",
      },
      Gray: {
        Front: "/images/hoodie/gray_front.png",
        Back: "/images/hoodie/gray_back.png",
        "L Sleeve": "/images/hoodie/gray_left.png",
        "R Sleeve": "/images/hoodie/gray_right.png",
      },
    },
    viewRegions: {
      Front: { xStart: 0, yStart: 0, xEnd: 1, yEnd: 1 },
      Back: { xStart: 0.25, yStart: 0.3, xEnd: 0.75, yEnd: 0.7 },
      "L Sleeve": { xStart: 0.15, yStart: 0.25, xEnd: 0.85, yEnd: 0.75 },
      "R Sleeve": { xStart: 0.15, yStart: 0.25, xEnd: 0.85, yEnd: 0.75 },
    },
  },
];

const designCategories = {
  Logos: [
    {
      id: "collage-1",
      name: "Cool Logo Collage",
      src: "/designs/star.png",
      designs: [
        {
          id: "element-1",
          src: "/designs/star.png",
          x: 0.4,
          y: 0.5,
          width: 0.2,
          height: 0.2,
        },
        {
          id: "element-2",
          src: "/designs/star.png",
          x: 0.6,
          y: 0.5,
          width: 0.15,
          height: 0.15,
        },
      ],
    },
    {
      id: "collage-2",
      name: "Cry Logo Collage",
      designs: [
        {
          id: "element-3",
          src: "/designs/part1.png",
          x: 0.4,
          y: 0.5,
          width: 0.2,
          height: 0.2,
        },
        {
          id: "element-4",
          src: "/designs/part2.png",
          x: 0.6,
          y: 0.5,
          width: 0.15,
          height: 0.15,
        },
        {
          id: "element-5",
          src: "/designs/part3.png",
          x: 0.1,
          y: 0.2,
          width: 0.4,
          height: 0.6,
        },
      ],
    },
    {
      id: "collage-3",
      name: "Cry Logo Collage22",
      designs: [
        {
          id: "element-6",
          src: "/designs/part1.png",
          x: 0.4,
          y: 0.5,
          width: 0.2,
          height: 0.2,
        },
        {
          id: "element-7",
          src: "/designs/part2.png",
          x: 0.6,
          y: 0.5,
          width: 0.15,
          height: 0.15,
        },
        {
          id: "element-8",
          src: "/designs/part3.png",
          x: 0.1,
          y: 0.2,
          width: 0.4,
          height: 0.6,
        },
      ],
    },
    {
      id: "collage-4",
      name: "Cry Logo Collage33",
      designs: [
        {
          id: "element-9",
          src: "/designs/part1.png",
          x: 0.4,
          y: 0.5,
          width: 0.2,
          height: 0.2,
        },
        {
          id: "element-10",
          src: "/designs/part2.png",
          x: 0.6,
          y: 0.5,
          width: 0.15,
          height: 0.15,
        },
        {
          id: "element-11",
          src: "/designs/part3.png",
          x: 0.1,
          y: 0.2,
          width: 0.4,
          height: 0.6,
        },
      ],
    },
  ],
  Shapes: [
    {
      id: "collage-3",
      name: "Minimal Shape Collage",
      designs: [
        {
          id: "element-6",
          src: "/designs/circle.png",
          x: 0.5,
          y: 0.5,
          width: 0.25,
          height: 0.25,
        },
      ],
    },
  ],
};

function ProductDesigner() {
  const [allProducts, setAllProducts] = useState([
    { id: 1, productType: "tshirt", name: "tshirt", color: "Red" },
  ]);
  const [activeProductId, setActiveProductId] = useState(1);
  const [designsByView, setDesignsByView] = useState({
    Front: [],
    Back: [],
    "L Sleeve": [],
    "R Sleeve": [],
  });
  const [designColor, setDesignColor] = useState("Blue");
  const [activePreview, setActivePreview] = useState("Front");
  const [showProductModal, setShowProductModal] = useState(false);
  const [showColorModal, setShowColorModal] = useState(false);
  const [activeTab, setActiveTab] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [pendingProductType, setPendingProductType] = useState(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [selectedDesignId, setSelectedDesignId] = useState(null);
  const [rotationAngles, setRotationAngles] = useState({});
  const [isRotating, setIsRotating] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [lockedWrapperPos, setLockedWrapperPos] = useState(null);
  const [lockedDesignId, setLockedDesignId] = useState(null);
  const [regionWidth, setRegionWidth] = useState(0);
  const [regionHeight, setRegionHeight] = useState(0);
  const [pendingText, setPendingText] = useState("");
  const [justFinishedInteraction, setJustFinishedInteraction] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [thumbSizes, setThumbSizes] = useState({
    Front: { w: 0, h: 0 },
    Back: { w: 0, h: 0 },
    "L Sleeve": { w: 0, h: 0 },
    "R Sleeve": { w: 0, h: 0 },
  });

  const previewRef = useRef(null);
  const imgRef = useRef(null);
  const panelRef = useRef(null);
  const scrollRef = useRef(null);
  const thumbRefs = {
    Front: useRef(null),
    Back: useRef(null),
    "L Sleeve": useRef(null),
    "R Sleeve": useRef(null),
  };

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.scrollTo({ left: el.scrollWidth, behavior: "smooth" });
    }
  }, [allProducts]); // runs every time a product is added/removed

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll);
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, []);

  const activeProduct = allProducts.find((p) => p.id === activeProductId);

  // ✅ Preserve designs across products by re-rendering relative to new region
  useEffect(() => {
    if (!imgRef.current) return;
    setDesignsByView((prev) => {
      const updated = {};
      for (const view of Object.keys(prev)) {
        updated[view] = prev[view].map((d) => ({
          ...d,
          x: d.x, // normalized stays the same
          y: d.y,
          width: d.width, // normalized
          height: d.height, // normalized
        }));
      }
      return updated;
    });
  }, [activeProductId, activePreview]);

  useEffect(
    (e) => {
      const handleClickOutside = (e) => {
        if (panelRef.current && panelRef.current.contains(e.target)) {
          return;
        }

        if (justFinishedInteraction) {
          // Suppress deselect once
          setJustFinishedInteraction(false);
          return;
        }

        if (isActive) return;

        if (isResizing || isRotating) return;
        if (selectedDesignId) setActiveTab("default");
        setSelectedDesignId(null);
      };
      window.addEventListener("mousedown", handleClickOutside);
      return () => window.removeEventListener("mousedown", handleClickOutside);
    },
    [
      isActive,
      isResizing,
      isRotating,
      selectedDesignId,
      justFinishedInteraction,
    ],
  );

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
  }, []);

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
  }, []);

  const filteredOptions = productOptions.filter((opt) =>
    opt.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const findFittingFontSize = (text, targetWidthPx, fontFamily = "Arial") => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const lines = text.split("\n");
    let low = 1;
    let high = 300;
    let fittingSize = low;

    while (low <= high) {
      const mid = (low + high) / 2;
      ctx.font = `${mid}px ${fontFamily}`;

      // measure the widest line
      let maxLineWidth = 0;
      for (const line of lines) {
        const metrics = ctx.measureText(line);
        if (metrics.width > maxLineWidth) {
          maxLineWidth = metrics.width;
        }
      }

      if (maxLineWidth <= targetWidthPx) {
        fittingSize = mid; // fits, try bigger
        low = mid + 0.2;
      } else {
        high = mid - 0.2; // too big, try smaller
      }
    }

    return fittingSize;
  };

  const textToImage = (
    text,
    fontSizePx = 24,
    fontFamily = "Arial",
    lineHeightMultiplier = 1,
  ) => {
    const lines = text.split("\n");

    // Create canvas
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    ctx.font = `${fontSizePx}px ${fontFamily}`;
    const lineHeight = fontSizePx * lineHeightMultiplier;

    // Measure widest line
    let maxWidth = 0;
    for (const line of lines) {
      const width = ctx.measureText(line).width;
      if (width > maxWidth) maxWidth = width;
    }

    // Set canvas size based on text
    canvas.width = maxWidth;
    canvas.height = lineHeight * lines.length;

    // Draw text
    ctx.font = `${fontSizePx}px ${fontFamily}`;
    ctx.textBaseline = "top";
    ctx.fillStyle = "black"; // text color
    lines.forEach((line, i) => {
      ctx.fillText(line, 0, i * lineHeight);
    });

    // Export as image
    return {
      img: canvas.toDataURL("image/png"),
      width: maxWidth,
      height: lineHeight * lines.length,
    };
  };

  const flipSelected = (direction) => {
    setDesignsByView((prev) => ({
      ...prev,
      [activePreview]: prev[activePreview].map((item) =>
        item.id === selectedDesignId
          ? {
              ...item,
              transform:
                direction === "horizontal" ? `scaleX(-1)` : `scaleY(-1)`,
            }
          : item,
      ),
    }));
  };

  const centerSelectedText = () => {
    setDesignsByView((prev) => ({
      ...prev,
      [activePreview]: prev[activePreview].map((item) =>
        item.id === selectedDesignId ? { ...item, x: 0.5, y: 0.5 } : item,
      ),
    }));
  };

  const toggleOutlineSelectedText = () => {
    setDesignsByView((prev) => ({
      ...prev,
      [activePreview]: prev[activePreview].map((item) =>
        item.id === selectedDesignId
          ? { ...item, outline: !item.outline }
          : item,
      ),
    }));
  };

  function getBoundingBox(w, h, angle) {
    const cos = Math.abs(Math.cos(angle));
    const sin = Math.abs(Math.sin(angle));
    return {
      width: w * cos + h * sin,
      height: w * sin + h * cos,
    };
  }

  const addProduct = () => {
    setIsAddingProduct(true);
    setShowProductModal(true);
  };

  const deleteProduct = (id) => {
    const updated = allProducts.filter((p) => p.id !== id);
    setAllProducts(updated);
    if (id === activeProductId && updated.length > 0) {
      setActiveProductId(updated[updated.length - 1].id);
    }
  };

  const changeProductType = (newType) => {
    setPendingProductType(newType);
    setShowProductModal(false);
    setShowColorModal(true);
  };

  const changeProductColor = (newColor) => {
    if (isAddingProduct && pendingProductType) {
      const newId = Date.now();
      const newProduct = {
        id: newId,
        productType: pendingProductType,
        name: pendingProductType,
        color: newColor,
      };
      setAllProducts([...allProducts, newProduct]);
      setActiveProductId(newId);
      setIsAddingProduct(false);
      setPendingProductType(null);
    } else if (pendingProductType) {
      setAllProducts(
        allProducts.map((p) =>
          p.id === activeProductId
            ? {
                ...p,
                productType: pendingProductType,
                color: newColor,
                name: pendingProductType,
              }
            : p,
        ),
      );
      setPendingProductType(null);
    } else {
      setAllProducts(
        allProducts.map((p) =>
          p.id === activeProductId ? { ...p, color: newColor } : p,
        ),
      );
    }
    setShowColorModal(false);
  };

  return (
    <div className="designer-container">
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        designCategories={designCategories}
        panelRef={panelRef}
        imgRef={imgRef}
        designsByView={designsByView}
        setDesignsByView={setDesignsByView}
        activePreview={activePreview}
        selectedDesignId={selectedDesignId}
        onClick={(e) => {
          e.stopPropagation();
        }}
      />

      {/* Main content */}
      <div className="main-content">
        {/* Product bar */}
        <div className="header-bar">
          <button onClick={addProduct} className="add-product">
            {" "}
            <i className="fa-solid fa-circle-plus"></i> Add Product
          </button>

          <div
            className="product-thumbnails-container"
            style={{
              maxWidth:
                allProducts.length === 1
                  ? "55px"
                  : allProducts.length === 2
                    ? "115px"
                    : "120px",
            }}
          >
            {/* Left fade + button */}
            <div className={`fade-left ${!canScrollLeft ? "hidden" : ""}`} />
            <button
              className={`scroll-btn left ${!canScrollLeft ? "hidden" : ""}`}
              onClick={() =>
                scrollRef.current.scrollBy({ left: -40, behavior: "smooth" })
              }
            >
              ‹
            </button>

            {/* Scrollable thumbnails */}
            <div className="product-thumbnails-scroll" ref={scrollRef}>
              {allProducts.map((p) => (
                <div
                  key={p.id}
                  className={`thumbnail ${p.id === activeProductId ? "active" : ""}`}
                  onClick={() => setActiveProductId(p.id)}
                >
                  {p.id === activeProductId && allProducts.length > 1 && (
                    <button
                      className="delete-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteProduct(p.id);
                      }}
                    >
                      ✖
                    </button>
                  )}
                  <img
                    src={
                      productOptions.find((opt) => opt.id === p.productType)
                        ?.viewImages[p.color]["Front"]
                    }
                    alt={p.name}
                    className="preview-image"
                  />
                  {/* Tooltip on hover */}
                  <div className="tooltip">{p.name}</div>
                </div>
              ))}
            </div>

            {/* Right fade + button */}
            <div className={`fade-right ${!canScrollRight ? "hidden" : ""}`} />
            <button
              className={`scroll-btn right ${!canScrollRight ? "hidden" : ""}`}
              onClick={() =>
                scrollRef.current.scrollBy({ left: 40, behavior: "smooth" })
              }
            >
              ›
            </button>
          </div>

          <button
            onClick={() => setShowProductModal(true)}
            className="add-product"
          >
            {" "}
            <i className="fa-solid fa-arrows-rotate"></i>
            Change Product
          </button>
          <button
            className="color-button"
            style={{ backgroundColor: activeProduct.color }}
            onClick={() => setShowColorModal(true)}
          >
            <div className="tooltip">{activeProduct.color}</div>
          </button>
        </div>

        {/* Product modal */}
        {showProductModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <button
                className="close-btn"
                onClick={() => {
                  setShowProductModal(false);
                  setIsAddingProduct(false);
                  setPendingProductType(null);
                }}
              >
                ✖
              </button>

              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                }}
                autoFocus
              />

              <div className="modal-grid">
                {filteredOptions.map((opt) => (
                  <div
                    key={opt.id}
                    onClick={() => changeProductType(opt.id)}
                    className={`modal-option ${activeProduct?.productType === opt.id ? "active" : ""}`}
                  >
                    <div className="modal-option-content">
                      <img
                        src={opt.viewImages[opt.productColors[0]].Front}
                        alt={opt.name}
                        className="modal-option-img"
                      />
                      <div className="option-name">{opt.name}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Product color modal */}
        {showColorModal && (
          <div className="modal-overlay">
            <div className="modal-content small">
              <button
                className="close-btn"
                onClick={() => {
                  setShowColorModal(false);
                  setIsAddingProduct(false);
                  setPendingProductType(null);
                }}
              >
                ✖
              </button>

              <h3>Select Product Color</h3>
              <div className="color-grid">
                {productOptions
                  .find(
                    (opt) =>
                      opt.id ===
                      (pendingProductType || activeProduct?.productType),
                  )
                  ?.productColors.map((c) => {
                    const isDuplicate = allProducts.some(
                      (p) =>
                        p.productType ===
                          (pendingProductType || activeProduct?.productType) &&
                        p.color === c,
                    );
                    return (
                      <div
                        key={c}
                        title={c}
                        onClick={() => !isDuplicate && changeProductColor(c)}
                        className={`color-swatch ${isDuplicate ? "disabled" : ""} ${activeProduct?.color === c ? "active" : ""}`}
                        style={{ backgroundColor: c.toLowerCase() }}
                      />
                    );
                  })}
              </div>
            </div>
          </div>
        )}

        {/* Right preview area */}
        <div className="preview-area">
          <div className="preview-grid">
            {/* Column 1: Active preview */}
            <div
              className="preview-image-wrapper"
              ref={previewRef}
              style={{ position: "relative" }}
            >
              <img
                ref={imgRef}
                src={
                  productOptions.find(
                    (opt) => opt.id === activeProduct?.productType,
                  )?.viewImages[activeProduct?.color][activePreview]
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
                const regionWidth = (region.xEnd - region.xStart) * w;
                const regionHeight = (region.yEnd - region.yStart) * h;

                const style = {
                  position: "absolute",
                  left: imgRef.current.offsetLeft + region.xStart * w,
                  top: imgRef.current.offsetTop + region.yStart * h,
                  width: regionWidth,
                  height: regionHeight,
                  border: isActive ? "2px dashed #333" : "none",
                  backgroundColor: isActive
                    ? "rgba(0,0,0,0.05)"
                    : "transparent",
                };

                return (
                  <div style={style}>
                    {selectedDesignId != null &&
                      isActive &&
                      Math.abs(
                        designsByView[activePreview].find(
                          (d) => d.id === selectedDesignId,
                        ).x *
                          regionWidth +
                          (designsByView[activePreview].find(
                            (d) => d.id === selectedDesignId,
                          ).width *
                            regionWidth) /
                            2 -
                          regionWidth / 2,
                      ) < 10 && (
                        <div
                          style={{
                            position: "absolute",
                            left: regionWidth / 2,
                            top: 0,
                            bottom: 0,
                            width: 1,
                            borderLeft: "2px dashed gray",
                            pointerEvents: "none",
                            zIndex: 0,
                          }}
                        />
                      )}
                    {designsByView[activePreview].map((d) => (
                      <Rnd
                        key={d.id}
                        style={{
                          zIndex: d.layer,
                        }}
                        size={getBoundingBox(
                          d.width * Math.min(regionWidth, regionHeight),
                          d.height * Math.min(regionWidth, regionHeight),
                          rotationAngles[d.id] || 0,
                        )}
                        position={
                          (isRotating || isResizing) &&
                          lockedWrapperPos &&
                          lockedDesignId === d.id
                            ? lockedWrapperPos
                            : { x: d.x * regionWidth, y: d.y * regionHeight }
                        }
                        bounds="parent"
                        // disableDragging={isRotating || isResizing}
                        enableResizing={false}
                        onDragStart={() => {
                          setIsActive(true);
                          setSelectedDesignId(d.id);
                        }}
                        onDrag={(e, data) => {
                          if (isRotating || isResizing) return;

                          const rawW =
                            d.width * Math.min(regionWidth, regionHeight);
                          const centerX = data.x + rawW / 2;
                          const regionCenterX = regionWidth / 2;
                          const threshold = 0.03 * regionWidth; // px tolerance

                          let normX = data.x;
                          const normY = data.y;

                          const distance = centerX - regionCenterX;

                          if (Math.abs(distance) < threshold) {
                            // use a quadratic easing curve for smoother pull
                            const strength =
                              0.35 *
                              Math.pow(1 - Math.abs(distance) / threshold, 2);
                            const targetX = regionCenterX - rawW / 2;

                            // blend drag position toward center
                            normX =
                              data.x * (1 - strength) + targetX * strength;
                          }
                          setDesignsByView((prev) => ({
                            ...prev,
                            [activePreview]: prev[activePreview].map((item) =>
                              item.id === d.id
                                ? {
                                    ...item,
                                    x: normX / regionWidth,
                                    y: normY / regionHeight,
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
                          className={`design-container ${selectedDesignId === d.id ? "active" : ""}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedDesignId(d.id);
                            if (d.text) {
                              // ✅ it's a text image
                              setActiveTab("addText");
                            } else {
                              // ✅ it's a normal design image
                              setActiveTab("editDesign");
                            }
                          }}
                          draggable="false"
                          style={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            transformOrigin: "center center",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width:
                              d.width * Math.min(regionWidth, regionHeight),
                            height:
                              d.height * Math.min(regionWidth, regionHeight),
                          }}
                        >
                          {/* Inner design wrapper */}
                          <div
                            className="design-wrapper"
                            draggable="false"
                            style={{
                              width:
                                d.width * Math.min(regionWidth, regionHeight),
                              height:
                                d.height * Math.min(regionWidth, regionHeight),
                              alignItems: "center",
                              objectFit: "contain",
                              transform: `rotate(${rotationAngles[d.id] || 0}rad)
                                          scaleX(${d.horizontalFlip ? -1 : 1})
                                          scaleY(${d.verticalFlip ? -1 : 1})`,
                              transformOrigin: "center center",
                            }}
                          >
                            <img
                              src={d.src}
                              alt={d.name}
                              className="preview-image"
                              draggable="false"
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "contain",
                                transform: d.transform ? d.transform : "",
                              }}
                            />
                          </div>
                          <div
                            className="bounding-box-overlay"
                            style={{
                              position: "absolute",
                              // top: "50%",
                              // left: "50%",
                              width: getBoundingBox(
                                d.width * Math.min(regionWidth, regionHeight),
                                d.height * Math.min(regionWidth, regionHeight),
                                rotationAngles[d.id] || 0,
                              ).width,
                              height: getBoundingBox(
                                d.width * Math.min(regionWidth, regionHeight),
                                d.height * Math.min(regionWidth, regionHeight),
                                rotationAngles[d.id] || 0,
                              ).height,
                              // transform: `translate(-50%, -50%)`,
                              // transformOrigin: "center center",
                              border:
                                selectedDesignId === d.id
                                  ? "2px solid rgba(0,0,0,0.2)"
                                  : "none",
                              backgroundColor:
                                selectedDesignId === d.id
                                  ? "rgba(255,255,255,0.05)"
                                  : "transparent",
                              cursor:
                                isRotating || isResizing ? "default" : "grab",
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
                                  }}
                                  onMouseDown={(e) => e.stopPropagation()}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveTab("default");
                                    setDesignsByView((prev) => ({
                                      ...prev,
                                      [activePreview]: prev[
                                        activePreview
                                      ].filter((item) => item.id !== d.id),
                                    }));
                                    setSelectedDesignId(null);
                                  }}
                                >
                                  ✖
                                </button>

                                <button
                                  className="control-btn"
                                  style={{
                                    position: "absolute",
                                    top: "-30px",
                                    left: "-30px",
                                    zIndex: 3000,
                                  }}
                                  draggable="false"
                                  onMouseDown={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    setIsRotating(true);
                                    setLockedDesignId(d.id);
                                    setLockedWrapperPos({
                                      x: d.x * regionWidth,
                                      y: d.y * regionHeight,
                                    });

                                    const rect =
                                      e.target.getBoundingClientRect();
                                    const centerX = rect.left + rect.width / 2;
                                    const centerY = rect.top + rect.height / 2;

                                    const startAngle = Math.atan2(
                                      e.clientY - centerY,
                                      e.clientX - centerX,
                                    );
                                    const baseline = rotationAngles[d.id] || 0;

                                    const handleMove = (moveEvent) => {
                                      const currentAngle = Math.atan2(
                                        moveEvent.clientY - centerY,
                                        moveEvent.clientX - centerX,
                                      );
                                      const delta = currentAngle - startAngle;
                                      const newAngle = baseline + delta;

                                      let bbox = getBoundingBox(
                                        d.width * regionWidth,
                                        d.height * regionHeight,
                                        newAngle,
                                      );
                                      let posX = d.x * regionWidth;
                                      let posY = d.y * regionHeight;

                                      if (posX < 0) posX = 0;
                                      if (posY < 0) posY = 0;
                                      if (posX + bbox.width > regionWidth)
                                        posX = regionWidth - bbox.width;
                                      if (posY + bbox.height > regionHeight)
                                        posY = regionHeight - bbox.height;

                                      if (
                                        bbox.width > regionWidth ||
                                        bbox.height > regionHeight
                                      ) {
                                        const widthRatio =
                                          regionWidth / bbox.width;
                                        const heightRatio =
                                          regionHeight / bbox.height;
                                        const scale = Math.min(
                                          widthRatio,
                                          heightRatio,
                                        );

                                        const newWidth =
                                          d.width * regionWidth * scale;
                                        const newHeight =
                                          d.height * regionHeight * scale;

                                        bbox = getBoundingBox(
                                          newWidth,
                                          newHeight,
                                          newAngle,
                                        );

                                        setDesignsByView((prev) => ({
                                          ...prev,
                                          [activePreview]: prev[
                                            activePreview
                                          ].map((item) =>
                                            item.id === d.id
                                              ? {
                                                  ...item,
                                                  x: posX / regionWidth,
                                                  y: posY / regionHeight,
                                                  width: newWidth / regionWidth,
                                                  height:
                                                    newHeight / regionHeight,
                                                }
                                              : item,
                                          ),
                                        }));
                                      } else {
                                        setDesignsByView((prev) => ({
                                          ...prev,
                                          [activePreview]: prev[
                                            activePreview
                                          ].map((item) =>
                                            item.id === d.id
                                              ? {
                                                  ...item,
                                                  x: posX / regionWidth,
                                                  y: posY / regionHeight,
                                                }
                                              : item,
                                          ),
                                        }));
                                      }

                                      setRotationAngles((prev) => ({
                                        ...prev,
                                        [d.id]: newAngle,
                                      }));
                                      setJustFinishedInteraction(true);
                                    };

                                    const handleUp = () => {
                                      setSelectedDesignId(d.id);
                                      setJustFinishedInteraction(true);
                                      setIsRotating(false);
                                      setLockedWrapperPos(null);
                                      window.removeEventListener(
                                        "mousemove",
                                        handleMove,
                                      );
                                      window.removeEventListener(
                                        "mouseup",
                                        handleUp,
                                      );
                                    };

                                    window.addEventListener(
                                      "mousemove",
                                      handleMove,
                                    );
                                    window.addEventListener(
                                      "mouseup",
                                      handleUp,
                                    );
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
                                    zIndex: 3000,
                                  }}
                                  onMouseDown={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    setIsResizing(true);
                                    setLockedDesignId(d.id);
                                    setLockedWrapperPos({
                                      x: d.x * regionWidth,
                                      y: d.y * regionHeight,
                                    });

                                    const startX = e.clientX;
                                    const startWidth = d.width * regionWidth;
                                    const startHeight = d.height * regionHeight;
                                    const aspectRatio =
                                      startWidth / startHeight;
                                    const currentAngle =
                                      rotationAngles[d.id] || 0;

                                    const handleMove = (moveEvent) => {
                                      const deltaX = moveEvent.clientX - startX;
                                      let newWidth = Math.max(
                                        50,
                                        startWidth + deltaX,
                                      );
                                      let newHeight = newWidth / aspectRatio;

                                      let bbox = getBoundingBox(
                                        newWidth,
                                        newHeight,
                                        currentAngle,
                                      );
                                      const posX = d.x * regionWidth;
                                      const posY = d.y * regionHeight;

                                      if (posX + bbox.width > regionWidth) {
                                        const widthRatio =
                                          (regionWidth - posX) / bbox.width;
                                        newWidth = newWidth * widthRatio;
                                        newHeight = newWidth / aspectRatio;
                                        bbox = getBoundingBox(
                                          newWidth,
                                          newHeight,
                                          currentAngle,
                                        );
                                      }
                                      if (posY + bbox.height > regionHeight) {
                                        const heightRatio =
                                          (regionHeight - posY) / bbox.height;
                                        newHeight = newHeight * heightRatio;
                                        newWidth = newHeight * aspectRatio;
                                        bbox = getBoundingBox(
                                          newWidth,
                                          newHeight,
                                          currentAngle,
                                        );
                                      }
                                      setDesignsByView((prev) => ({
                                        ...prev,
                                        [activePreview]: prev[
                                          activePreview
                                        ].map((item) => {
                                          if (item.id !== d.id) return item;

                                          return {
                                            ...item,
                                            width: newWidth / regionWidth,
                                            height: newHeight / regionHeight,
                                            // ✅ src stays the same
                                          };
                                        }),
                                      }));
                                      setJustFinishedInteraction(true);
                                    };

                                    const handleUp = () => {
                                      setJustFinishedInteraction(true);
                                      setIsResizing(false);
                                      setSelectedDesignId(d.id);
                                      window.removeEventListener(
                                        "mousemove",
                                        handleMove,
                                      );
                                      window.removeEventListener(
                                        "mouseup",
                                        handleUp,
                                      );
                                    };

                                    window.addEventListener(
                                      "mousemove",
                                      handleMove,
                                    );
                                    window.addEventListener(
                                      "mouseup",
                                      handleUp,
                                    );
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
                        </div>
                      </Rnd>
                    ))}
                  </div>
                );
              })()}
            </div>

            {/* Column 2: Thumbnails stacked */}
            <div className="view-thumbnails">
              {["Front", "Back", "L Sleeve", "R Sleeve"].map((view) => (
                <div
                  key={view}
                  className={`view-thumbnail ${activePreview === view ? "active" : ""}`}
                  onClick={() => setActivePreview(view)}
                >
                  <img
                    src={
                      productOptions.find(
                        (opt) => opt.id === activeProduct?.productType,
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
                          (opt) => opt.id === activeProduct?.productType,
                        )?.viewRegions[view].xStart * thumbSizes[view].w,
                      top:
                        productOptions.find(
                          (opt) => opt.id === activeProduct?.productType,
                        )?.viewRegions[view].yStart * thumbSizes[view].h,
                      width:
                        (productOptions.find(
                          (opt) => opt.id === activeProduct?.productType,
                        )?.viewRegions[view].xEnd -
                          productOptions.find(
                            (opt) => opt.id === activeProduct?.productType,
                          )?.viewRegions[view].xStart) *
                        thumbSizes[view].w,
                      height:
                        (productOptions.find(
                          (opt) => opt.id === activeProduct?.productType,
                        )?.viewRegions[view].yEnd -
                          productOptions.find(
                            (opt) => opt.id === activeProduct?.productType,
                          )?.viewRegions[view].yStart) *
                        thumbSizes[view].h,
                    }}
                  >
                    {designsByView[view]?.map((design) => (
                      <img
                        key={design.id}
                        src={design.src}
                        alt="design overlay"
                        className="preview-image"
                        style={{
                          position: "absolute",
                          left: `${design.x * 100}%`,
                          top: `${design.y * 100}%`,
                          width: `${design.width * 100}%`,
                          height: `${design.height * 100}%`,
                          transform: `rotate(${rotationAngles[design.id] || 0}rad)`,
                          pointerEvents: "none",
                        }}
                      />
                    ))}
                  </div>
                  <div className="option-name">{view}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDesigner;
