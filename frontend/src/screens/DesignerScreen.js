import React, { useState, useRef, useEffect } from "react";
import { Rnd } from "react-rnd";
import "./ProductDesigner.css"; // responsive styles

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
        "R Sleeve": "/images/tshirt/red_right.png",
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
      Back: { xStart: 0.2, yStart: 0.25, xEnd: 0.8, yEnd: 0.75 },
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

export default function ProductDesigner() {
  const [allProducts, setAllProducts] = useState([
    { id: 1, productType: "tshirt", name: "Product 1", color: "Red" },
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
  const [showDesignModal, setShowDesignModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
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
  const [designCounter, setDesignCounter] = useState(0);
  const [regionWidth, setRegionWidth] = useState(0);
  const [regionHeight, setRegionHeight] = useState(0);
  const [activePanelTab, setActivePanelTab] = useState("default");
  const [pendingText, setPendingText] = useState("");
  const [textAdded, setTextAdded] = useState(false);

  const previewRef = useRef(null);
  const imgRef = useRef(null);

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

  useEffect(() => {
    const handleClickOutside = () => {
      if (isResizing || isRotating) return;
      setSelectedDesignId(null);
      setActivePanelTab("default");
    };
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
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
    ctx.letterSpacing = "0.08em";

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
    canvas.width = Math.ceil(maxWidth);
    canvas.height = Math.ceil(lineHeight * lines.length);

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
      setActiveProductId(updated[0].id);
    }
  };

  const changeProductType = (newType) => {
    setPendingProductType(newType);
    setShowProductModal(false);
    setShowColorModal(true);
  };

  const changeProductColor = (newColor) => {
    if (isAddingProduct && pendingProductType) {
      const newId = allProducts.length + 1;
      const newProduct = {
        id: newId,
        productType: pendingProductType,
        name: `Product ${newId}`,
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
            ? { ...p, productType: pendingProductType, color: newColor }
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

  const addDesignCollageToActiveView = (collage) => {
    if (!imgRef.current) return;

    setDesignCounter((prev) => prev + collage.designs.length);

    setDesignsByView((prev) => ({
      ...prev,
      [activePreview]: [
        ...prev[activePreview],
        ...collage.designs.map((d, idx) => ({
          ...d,
          id: `design-${designCounter + idx + 1}`,
          x: d.x,
          y: d.y,
          width: d.width, // already normalized in data
          height: d.height, // already normalized in data
          fontSize: d.fontSize,
        })),
      ],
    }));
  };

  return (
    <div className="designer-container">
      {/* Sidebar */}
      <div className="sidebar">
        {activePanelTab === "default" && (
          <>
            <h3>Designs</h3>
            <button
              onClick={() => {
                setShowDesignModal(true);
              }}
            >
              ➕ Add Design
            </button>

            <h3>Upload Design</h3>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (ev) => {
                    addDesignCollageToActiveView({
                      id: `upload-${Date.now()}`,
                      name: file.name,
                      designs: [
                        {
                          id: `element-${Date.now()}`,
                          src: ev.target.result,
                          x: 0.5,
                          y: 0.5,
                          width: 0.2,
                          height: 0.2,
                        },
                      ],
                    });
                    setActivePanelTab("editDesign"); // ✅ switch to edit tab
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />

            <h3>Add Text</h3>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActivePanelTab("addText");
                setTextAdded(false);
              }}
            >
              📝 Add Text
            </button>
          </>
        )}

        {activePanelTab === "editDesign" && (
          <>
            <h3>Edit Design</h3>
            <button onClick={(e) =>{
              e.stopPropagation();
              flipSelected("horizontal");
            }}>
              Flip Horizontal
            </button>
            <button onClick={(e) =>{
              e.stopPropagation();
              flipSelected("vertical");
            }}>
              Flip Vertical
            </button>
            <input
              type="color"
              value={designColor}
              onChange={(e) =>{
                e.stopPropagation();
                setDesignColor(e.target.value);
              }}
            />
            <button onClick={() => setActivePanelTab("default")}>⬅ Back</button>
          </>
        )}

        {activePanelTab === "addText" && (
          <>
            <h3>Add Text</h3>
            <textarea
              placeholder="Type your text here..."
              rows={1}
              style={{ width: "100%", padding: "0.5rem" }}
              value={pendingText}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => setPendingText(e.target.value)}
            />

            <button
              onClick={(e) => {
                e.stopPropagation();
                if (pendingText.trim() !== "") {
                  const initialFontSizePx = 24;
                  const imageData = textToImage(pendingText, initialFontSizePx);
                  const id = `text-${Date.now()}`;

                  addDesignCollageToActiveView({
                    id: id,
                    name: "Text Image",
                    designs: [
                      {
                        id: `element-${Date.now()}`,
                        src: imageData.img, // ✅ treat as normal image
                        text: pendingText,
                        x: 0.5,
                        y: 0.5,
                        width: imageData.width / regionWidth,
                        height: imageData.height / regionHeight,
                        fontSize: initialFontSizePx / regionHeight,
                        rotation: 0,
                      },
                    ],
                  });

                  setPendingText("");
                  setSelectedDesignId(id);
                  setTextAdded(true);
                  setActivePanelTab("addText");
                }
              }}
            >
              ➕ Add Text
            </button>

            {/* ✅ Only show options if textAdded is true */}
            {textAdded && (
              <>
                <h4>Text Options</h4>
                <input
                  type="color"
                  value={designColor}
                  onChange={(e) => setDesignColor(e.target.value)}
                />
                <button onClick={() => centerSelectedText()}>
                  Center Text
                </button>
                <button onClick={() => toggleOutlineSelectedText()}>
                  Toggle Outline
                </button>
              </>
            )}

            <button onClick={() => setActivePanelTab("default")}>⬅ Back</button>
          </>
        )}
      </div>

      {/* Main content */}
      <div className="main-content">
        {/* Product bar */}
        <div className="header-bar">
          <button onClick={addProduct}>➕ Add Product</button>
          <button onClick={() => setShowProductModal(true)}>
            🔄 Change Product
          </button>
          <button onClick={() => setShowColorModal(true)}>
            🎨 Change Color
          </button>

          <div className="product-thumbnails">
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
                <div className="option-name">{p.name}</div>
              </div>
            ))}
          </div>

          <div className="active-label">
            {activeProduct?.name} — <span>{activeProduct?.color}</span>
          </div>
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

        {/* Design modal */}
        {showDesignModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <button
                className="close-btn"
                onClick={() => {
                  setShowDesignModal(false);
                  setSelectedCategory(null);
                }}
              >
                ✖
              </button>

              {!selectedCategory && (
                <>
                  <h3>Select a Category</h3>
                  <div className="modal-grid">
                    {Object.keys(designCategories).map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className="modal-option"
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </>
              )}

              {selectedCategory && (
                <>
                  <h3>{selectedCategory} Designs</h3>
                  <div className="modal-grid">
                    {designCategories[selectedCategory].map((d) => (
                      <div key={d.id} className="design-thumb-wrapper">
                        <img
                          src={d.src}
                          alt={d.name}
                          className={`design-thumb ${designsByView[activePreview].some((item) => item.id === d.id) ? "active" : ""}`}
                          onClick={() => {
                            addDesignCollageToActiveView(d);
                            setShowDesignModal(false);
                            setSelectedCategory(null);
                            setActivePanelTab("editDesign");
                          }}
                        />
                        <div className="option-name">{d.name}</div>
                      </div>
                    ))}
                  </div>
                </>
              )}
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
            <div className="active-preview">
              <h3>{activePreview} Preview</h3>
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
                      {designsByView[activePreview].map((d) => (
                        <Rnd
                          key={d.id}
                          size={getBoundingBox(
                            d.width * regionWidth,
                            d.height * regionHeight,
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
                          disableDragging={isRotating || isResizing}
                          enableResizing={false}
                          onDragStart={() => {
                            if (isRotating || isResizing) return;
                            setIsActive(true);
                          }}
                          onDrag={(e, data) => {
                            if (isRotating || isResizing) return;
                            const normX = data.x / regionWidth;
                            const normY = data.y / regionHeight;
                            setDesignsByView((prev) => ({
                              ...prev,
                              [activePreview]: prev[activePreview].map(
                                (item) =>
                                  item.id === d.id
                                    ? { ...item, x: normX, y: normY }
                                    : item,
                              ),
                            }));
                          }}
                          onDragStop={() => {
                            if (isRotating || isResizing) return;
                            setIsActive(false);
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
                                setActivePanelTab("addText");
                              } else {
                                // ✅ it's a normal design image
                                setActivePanelTab("editDesign");
                              }
                            }}
                            style={{
                              position: "relative",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              width: getBoundingBox(
                                d.width * regionWidth,
                                d.height * regionHeight,
                                rotationAngles[d.id] || 0,
                              ).width,
                              height: getBoundingBox(
                                d.width * regionWidth,
                                d.height * regionHeight,
                                rotationAngles[d.id] || 0,
                              ).height,
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
                            {/* Inner design wrapper */}
                            <div
                              className="design-wrapper"
                              style={{
                                width: d.width * regionWidth,
                                height: d.height * regionHeight,
                                transform: `rotate(${rotationAngles[d.id] || 0}rad)`,
                                transformOrigin: "center center",
                              }}
                            >
                              {d.src ? (
                                <img
                                  src={d.src}
                                  alt={d.name}
                                  className="preview-image"
                                />
                              ) : (
                                <div
                                  style={{
                                    fontSize: `${d.fontSize * regionHeight}px`, // ✅ scales with box height

                                    fontWeight: "bold",
                                    fontFamily: "Arial",
                                    color: designColor,
                                    textAlign: "center",
                                    width: "100%",
                                    height: "100%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    lineHeight: 1,
                                    whiteSpace: "pre-line",
                                  }}
                                >
                                  {d.text}
                                </div>
                              )}
                            </div>
                            {selectedDesignId === d.id && (
                              <>
                                <button
                                  style={{
                                    position: "absolute",
                                    top: "-30px",
                                    right: "-30px",
                                    zIndex: 3000,
                                  }}
                                  onMouseDown={(e) => e.stopPropagation()}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setActivePanelTab("default");
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
                                  style={{
                                    position: "absolute",
                                    top: "-30px",
                                    left: "-30px",
                                    zIndex: 3000,
                                  }}
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
                                    };

                                    const handleUp = () => {
                                      setSelectedDesignId(d.id);
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
                                  ⟳
                                </button>

                                <button
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

                                          // Step 1: recalc font size from new width
                                          const fittingFontSizePx =
                                            findFittingFontSize(
                                              item.text,
                                              newWidth,
                                            );

                                          // Step 2: regenerate image at new font size
                                          const imageData = textToImage(
                                            item.text,
                                            fittingFontSizePx,
                                          ).img;

                                          // Step 3: recalc height
                                          const lineHeight = fittingFontSizePx;
                                          const totalHeightPx =
                                            lineHeight *
                                            item.text.split("\n").length;

                                          return {
                                            ...item,
                                            width: newWidth / regionWidth,
                                            height:
                                              totalHeightPx / regionHeight,
                                            fontSize:
                                              fittingFontSizePx / regionHeight,
                                            src: imageData, // ✅ updated image
                                          };
                                        }),
                                      }));
                                    };

                                    const handleUp = () => {
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
                                  ⇲
                                </button>
                              </>
                            )}
                          </div>
                        </Rnd>
                      ))}
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Column 2: Thumbnails stacked */}
            <div className="view-thumbnails">
              {["Front", "Back", "L Sleeve", "R Sleeve"].map((view) => (
                <div
                  key={view}
                  className={`thumbnail ${activePreview === view ? "active" : ""}`}
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
                  />
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
