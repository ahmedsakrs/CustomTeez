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
        "R Sleeve": "/images/tshirt/red_right.png"
      },
      Blue: {
        Front: "/images/tshirt/blue_front.png",
        Back: "/images/tshirt/blue_back.png",
        "L Sleeve": "/images/tshirt/blue_left.png",
        "R Sleeve": "/images/tshirt/blue_right.png"
      }
    },
    viewRegions: {
      Front: { xStart: 0, yStart: 0, xEnd: 1, yEnd: 1 },
      Back: { xStart: 0.2, yStart: 0.25, xEnd: 0.8, yEnd: 0.75 },
      "L Sleeve": { xStart: 0.1, yStart: 0.2, xEnd: 0.9, yEnd: 0.8 },
      "R Sleeve": { xStart: 0.1, yStart: 0.2, xEnd: 0.9, yEnd: 0.8 }
    }
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
        "R Sleeve": "/images/hoodie/black_right.png"
      },
      Gray: {
        Front: "/images/hoodie/gray_front.png",
        Back: "/images/hoodie/gray_back.png",
        "L Sleeve": "/images/hoodie/gray_left.png",
        "R Sleeve": "/images/hoodie/gray_right.png"
      }
    },
    viewRegions: {
      Front: { xStart: 0, yStart: 0, xEnd: 1, yEnd: 1 },
      Back: { xStart: 0.25, yStart: 0.3, xEnd: 0.75, yEnd: 0.7 },
      "L Sleeve": { xStart: 0.15, yStart: 0.25, xEnd: 0.85, yEnd: 0.75 },
      "R Sleeve": { xStart: 0.15, yStart: 0.25, xEnd: 0.85, yEnd: 0.75 }
    }
  }
];

const designCategories = {
  Shapes: [
    { id: "star", name: "Star", src: "/designs/star.png" },
    { id: "circle", name: "Circle", src: "/designs/circle.png" }
  ],
  Logos: [
    { id: "logo1", name: "Logo 1", src: "/designs/logo1.png" },
    { id: "logo2", name: "Logo 2", src: "/designs/logo2.png" }
  ],
  "Text Styles": [
    { id: "text1", name: "Bold Text", src: "/designs/text1.png" },
    { id: "text2", name: "Italic Text", src: "/designs/text2.png" }
  ]
};

export default function ProductDesigner() {
  const [allProducts, setAllProducts] = useState([
    { id: 1, productType: "tshirt", name: "Product 1", color: "Red" }
  ]);
  const [activeProductId, setActiveProductId] = useState(1);
  const [designsByView, setDesignsByView] = useState({
    Front: [],
    Back: [],
    "L Sleeve": [],
    "R Sleeve": []
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
  const [startAngle, setStartAngle] = useState(null);
  const [initialRotation, setInitialRotation] = useState(null);
  const [isRotating, setIsRotating] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [lockedWrapperPos, setLockedWrapperPos] = useState(null);
  const [lockedDesignId, setLockedDesignId] = useState(null);
  const [designCounter, setDesignCounter] = useState(0);


  const previewRef = useRef(null);
  const imgRef = useRef(null);

  const activeProduct = allProducts.find(p => p.id === activeProductId);

  // ✅ Preserve designs across products by re-rendering relative to new region
  useEffect(() => {
    const product = productOptions.find(opt => opt.id === activeProduct?.productType);
    const region = product?.viewRegions[activePreview];
    if (!product || !region || !imgRef.current) return;

    const w = imgRef.current.offsetWidth;
    const h = imgRef.current.offsetHeight;
    const regionWidth = (region.xEnd - region.xStart) * w;
    const regionHeight = (region.yEnd - region.yStart) * h;

    setDesignsByView(prev => {
      const updated = {};
      for (const view of Object.keys(prev)) {
        updated[view] = prev[view].map(d => ({
          ...d,
          x: d.x, // normalized stays the same
          y: d.y,
          width: d.width,
          height: d.height
        }));
      }
      return updated;
    });
  }, [activeProductId, activePreview]);

useEffect(() => {
  const handleClickOutside = () => setSelectedDesignId(null);
  window.addEventListener("click", handleClickOutside);
  return () => window.removeEventListener("click", handleClickOutside);
}, []);

function getBoundingBox(w, h, angle) {
  const cos = Math.abs(Math.cos(angle));
  const sin = Math.abs(Math.sin(angle));
  return {
    width: w * cos + h * sin,
    height: w * sin + h * cos
  };
}


  const addProduct = () => {
    setIsAddingProduct(true);
    setShowProductModal(true);
  };

  const deleteProduct = (id) => {
    const updated = allProducts.filter(p => p.id !== id);
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
        color: newColor
      };
      setAllProducts([...allProducts, newProduct]);
      setActiveProductId(newId);
      setIsAddingProduct(false);
      setPendingProductType(null);
    } else if (pendingProductType) {
      setAllProducts(allProducts.map(p =>
        p.id === activeProductId
          ? { ...p, productType: pendingProductType, color: newColor }
          : p
      ));
      setPendingProductType(null);
    } else {
      setAllProducts(allProducts.map(p =>
        p.id === activeProductId ? { ...p, color: newColor } : p
      ));
    }
    setShowColorModal(false);
  };

  const filteredOptions = productOptions.filter(opt =>
    opt.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addDesignToActiveView = (newDesign) => {
  const product = productOptions.find(opt => opt.id === activeProduct?.productType);
  const region = product?.viewRegions[activePreview];
  if (!region || !imgRef.current) return;

  const w = imgRef.current.offsetWidth;
  const h = imgRef.current.offsetHeight;
  const regionWidth = (region.xEnd - region.xStart) * w;
  const regionHeight = (region.yEnd - region.yStart) * h;

  // Increment counter and assign unique ID
  setDesignCounter(prev => prev + 1);
  const uniqueId = `design-${designCounter + 1}`;

  setDesignsByView(prev => ({
    ...prev,
    [activePreview]: [
      ...prev[activePreview],
      {
        ...newDesign,
        id: uniqueId,   // ✅ unique incremental ID
        x: 0.5,
        y: 0.5,
        width: 100,
        height: 100
      }
    ]
  }));
};

  return (
    <div className="designer-container">
      {/* Sidebar */}
      <div className="sidebar">
        <h3>Designs</h3>
        <button onClick={() => setShowDesignModal(true)}>➕ Add Design</button>

        <h3>Upload Design</h3>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = (ev) => {
                addDesignToActiveView({
                  id: Date.now(),
                  name: file.name,
                  src: ev.target.result
                });
              };
              reader.readAsDataURL(file);
            }
          }}
        />

        <h3>Add Text</h3>
        <input
          type="text"
          placeholder="Enter text..."
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.target.value.trim() !== "") {
              addDesignToActiveView({
                id: Date.now(),
                name: "Custom Text",
                src: "",
                text: e.target.value.trim()
              });
              e.target.value = "";
            }
          }}
          style={{ width: "100%", padding: "0.5rem" }}
        />
      </div>

      {/* Main content */}
      <div className="main-content">
        {/* Product bar */}
        <div className="header-bar">
          <button onClick={addProduct}>➕ Add Product</button>
          <button onClick={() => setShowProductModal(true)}>🔄 Change Product</button>
          <button onClick={() => setShowColorModal(true)}>🎨 Change Color</button>

          <div className="product-thumbnails">
            {allProducts.map(p => (
              <div
                key={p.id}
                className={`thumbnail ${p.id === activeProductId ? "active" : ""}`}
                onClick={() => setActiveProductId(p.id)}
              >
                {p.id === activeProductId && allProducts.length > 1 && (
                  <button
                    className="delete-btn"
                    onClick={(e) => { e.stopPropagation(); deleteProduct(p.id); }}
                  >
                    ✖
                  </button>
                )}
                <img
                  src={
                    productOptions.find(opt => opt.id === p.productType)
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
                onClick={() => { setShowProductModal(false); setIsAddingProduct(false); setPendingProductType(null); }}
              >
                ✖
              </button>

              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); }}
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
                onClick={() => { setShowDesignModal(false); setSelectedCategory(null); }}
              >
                ✖
              </button>

              {!selectedCategory && (
                <>
                  <h3>Select a Category</h3>
                  <div className="modal-grid">
                    {Object.keys(designCategories).map(cat => (
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
                    {designCategories[selectedCategory].map(d => (
                      <div key={d.id} className="design-thumb-wrapper">
                        <img
                          src={d.src}
                          alt={d.name}
                          className={`design-thumb ${designsByView[activePreview].some(item => item.id === d.id) ? "active" : ""}`}
                          onClick={() => { addDesignToActiveView(d); setShowDesignModal(false); setSelectedCategory(null); }}
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
                onClick={() => { setShowColorModal(false); setIsAddingProduct(false); setPendingProductType(null); }}
              >
                ✖
              </button>

              <h3>Select Product Color</h3>
              <div className="color-grid">
                {productOptions.find(opt => opt.id === (pendingProductType || activeProduct?.productType))
                  ?.productColors.map((c) => {
                    const isDuplicate = allProducts.some(
                      p => p.productType === (pendingProductType || activeProduct?.productType) && p.color === c
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
              <div className="preview-image-wrapper" ref={previewRef} style={{ position: "relative" }}>
                <img
                  ref={imgRef}
                  src={
                    productOptions.find(opt => opt.id === activeProduct?.productType)
                      ?.viewImages[activeProduct?.color][activePreview]
                  }
                  alt={`${activeProduct?.name} ${activePreview}`}
                  className="preview-image"
                  style={{ display: "block" }}
                />

                {/* Region overlay aligned to the image */}
                {(() => {
                  const product = productOptions.find(opt => opt.id === activeProduct?.productType);
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
                    backgroundColor: isActive ? "rgba(0,0,0,0.05)" : "transparent"
                  };

                  return (
                    <div style={style}>
                      {designsByView[activePreview].map(d => (
                        <Rnd
  key={d.id}
  size={getBoundingBox(d.width, d.height, rotationAngles[d.id] || 0)}
  position={
  (isRotating || isResizing) && lockedWrapperPos && lockedDesignId === d.id
    ? lockedWrapperPos   // ✅ only lock the active design
    : { x: d.x * regionWidth, y: d.y * regionHeight }
}
  bounds="parent"
  disableDragging={isRotating || isResizing}
  onDragStart={(e, data) => {
    if (isRotating || isResizing) return;
    setIsActive(true);
  }}
  onDrag={(e, data) => {
    if (isRotating || isResizing) return;
    const normX = data.x / regionWidth;
    const normY = data.y / regionHeight;
    setDesignsByView(prev => ({
      ...prev,
      [activePreview]: prev[activePreview].map(item =>
        item.id === d.id ? { ...item, x: normX, y: normY } : item
      )
    }));
  }}
  onDragStop={() => {
    if (isRotating || isResizing) return;
    setIsActive(false);
  }}
>
  {/* Outer wrapper (no rotation, border updates with size) */}
  <div
    className={`design-container ${selectedDesignId === d.id ? "active" : ""}`}
    onClick={(e) => {
      e.stopPropagation();
      setSelectedDesignId(d.id);
    }}
    style={{
      position: "relative",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: getBoundingBox(d.width, d.height, rotationAngles[d.id] || 0).width,
      height: getBoundingBox(d.width, d.height, rotationAngles[d.id] || 0).height,
      border: selectedDesignId === d.id ? "2px solid rgba(0,0,0,0.2)" : "none",
      backgroundColor: selectedDesignId === d.id ? "rgba(255,255,255,0.05)" : "transparent"
    }}
  >
    {/* Inner design wrapper (rotates and stays centered) */}
    <div
      className="design-wrapper"
      style={{
        width: d.width,
        height: d.height,
        transform: `rotate(${rotationAngles[d.id] || 0}rad)`,
        transformOrigin: "center center"
      }}
    >
      {d.src ? (
        <img src={d.src} alt={d.name} className="preview-image" />
      ) : (
        <div style={{ fontSize: "2rem", fontWeight: "bold", color: designColor }}>
          {d.text}
        </div>
      )}
    </div>

    {/* Buttons stay upright */}
    {selectedDesignId === d.id && (
      <>
        <button
          style={{ position: "absolute", top: "-30px", right: "-30px", zIndex:3000 }}
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            setDesignsByView(prev => ({
              ...prev,
              [activePreview]: prev[activePreview].filter(item => item.id !== d.id)
            }));
            setSelectedDesignId(null);
          }}
        >
          ✖
        </button>

        <button
          style={{ position: "absolute", top: "-30px", left: "-30px", zIndex:3000 }}
          onMouseDown={(e) => {
  e.stopPropagation();
  e.preventDefault();
  setIsRotating(true);
  setLockedDesignId(d.id);
  setLockedWrapperPos({ x: d.x * regionWidth, y: d.y * regionHeight });

  const rect = e.target.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  const startAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
  const baseline = rotationAngles[d.id] || 0;

  const handleMove = (moveEvent) => {
  const currentAngle = Math.atan2(moveEvent.clientY - centerY, moveEvent.clientX - centerX);
  const delta = currentAngle - startAngle;
  const newAngle = baseline + delta;

  // Compute rotated bounding box
  let bbox = getBoundingBox(d.width, d.height, newAngle);
  let posX = d.x * regionWidth;
  let posY = d.y * regionHeight;

  // Shift inside region
  if (posX < 0) posX = 0;
  if (posY < 0) posY = 0;
  if (posX + bbox.width > regionWidth) posX = regionWidth - bbox.width;
  if (posY + bbox.height > regionHeight) posY = regionHeight - bbox.height;

  // ✅ Resize if rotated box is larger than region
  if (bbox.width > regionWidth || bbox.height > regionHeight) {
    const widthRatio = regionWidth / bbox.width;
    const heightRatio = regionHeight / bbox.height;
    const scale = Math.min(widthRatio, heightRatio); // shrink until both fit

    // Apply scale to original design dimensions
    const newWidth = d.width * scale;
    const newHeight = d.height * scale;

    bbox = getBoundingBox(newWidth, newHeight, newAngle);

    // Re‑shift after resizing
    if (posX + bbox.width > regionWidth) posX = regionWidth - bbox.width;
    if (posY + bbox.height > regionHeight) posY = regionHeight - bbox.height;

    setDesignsByView(prev => ({
      ...prev,
      [activePreview]: prev[activePreview].map(item =>
        item.id === d.id
          ? {
              ...item,
              x: posX / regionWidth,
              y: posY / regionHeight,
              width: newWidth,
              height: newHeight
            }
          : item
      )
    }));
  } else {
    // No resize needed, just update position
    setDesignsByView(prev => ({
      ...prev,
      [activePreview]: prev[activePreview].map(item =>
        item.id === d.id
          ? {
              ...item,
              x: posX / regionWidth,
              y: posY / regionHeight
            }
          : item
      )
    }));
  }

  setRotationAngles(prev => ({
    ...prev,
    [d.id]: newAngle
  }));
};




  const handleUp = () => {
  setIsRotating(false);
  setLockedDesignId(null);
  setLockedWrapperPos(null);
  setSelectedDesignId(d.id);

  // Final clamp before releasing
  const newAngle = rotationAngles[d.id] || 0;
  let bbox = getBoundingBox(d.width, d.height, newAngle);
  let posX = d.x * regionWidth;
  let posY = d.y * regionHeight;

  if (posX < 0) posX = 0;
  if (posY < 0) posY = 0;
  if (posX + bbox.width > regionWidth) posX = regionWidth - bbox.width;
  if (posY + bbox.height > regionHeight) posY = regionHeight - bbox.height;

  // Resize if still overflowing
  if (bbox.width > regionWidth || bbox.height > regionHeight) {
    const widthRatio = regionWidth / bbox.width;
    const heightRatio = regionHeight / bbox.height;
    const scale = Math.min(widthRatio, heightRatio);

    const newWidth = d.width * scale;
    const newHeight = d.height * scale;
    bbox = getBoundingBox(newWidth, newHeight, newAngle);

    posX = Math.max(0, Math.min(posX, regionWidth - bbox.width));
    posY = Math.max(0, Math.min(posY, regionHeight - bbox.height));

    setDesignsByView(prev => ({
      ...prev,
      [activePreview]: prev[activePreview].map(item =>
        item.id === d.id
          ? { ...item, x: posX / regionWidth, y: posY / regionHeight, width: newWidth, height: newHeight }
          : item
      )
    }));
  } else {
    setDesignsByView(prev => ({
      ...prev,
      [activePreview]: prev[activePreview].map(item =>
        item.id === d.id
          ? { ...item, x: posX / regionWidth, y: posY / regionHeight }
          : item
      )
    }));
  }

  window.removeEventListener("mousemove", handleMove);
  window.removeEventListener("mouseup", handleUp);
};

  window.addEventListener("mousemove", handleMove);
  window.addEventListener("mouseup", handleUp);
}}

        >
          ⟳
        </button>

        <button
          style={{ position: "absolute", bottom: "-30px", right: "-30px", zIndex:3000 }}
          onMouseDown={(e) => {
  e.stopPropagation();
  e.preventDefault();
  setIsResizing(true);
  setLockedDesignId(d.id);
  setLockedWrapperPos({ x: d.x * regionWidth, y: d.y * regionHeight });

  const startX = e.clientX;
  const startWidth = d.width;
  const startHeight = d.height;
  const aspectRatio = startWidth / startHeight;
  const currentAngle = rotationAngles[d.id] || 0;

  const handleMove = (moveEvent) => {
    const deltaX = moveEvent.clientX - startX;
    let newWidth = Math.max(50, startWidth + deltaX);
    let newHeight = newWidth / aspectRatio;

    // ✅ Compute rotated bounding box
    let bbox = getBoundingBox(newWidth, newHeight, currentAngle);

    const posX = d.x * regionWidth;
    const posY = d.y * regionHeight;

    // ✅ Clamp so rotated bounding box fits inside region
    if (posX + bbox.width > regionWidth) {
      const widthRatio = (regionWidth - posX) / bbox.width;
      newWidth = newWidth * widthRatio;
      newHeight = newWidth / aspectRatio;
      bbox = getBoundingBox(newWidth, newHeight, currentAngle);
    }
    if (posY + bbox.height > regionHeight) {
      const heightRatio = (regionHeight - posY) / bbox.height;
      newHeight = newHeight * heightRatio;
      newWidth = newHeight * aspectRatio;
      bbox = getBoundingBox(newWidth, newHeight, currentAngle);
    }

    setDesignsByView(prev => ({
      ...prev,
      [activePreview]: prev[activePreview].map(item =>
        item.id === d.id ? { ...item, width: newWidth, height: newHeight } : item
      )
    }));
  };

  const handleUp = () => {
    setIsResizing(false);
    setLockedDesignId(null);
    setLockedWrapperPos(null);
    setSelectedDesignId(d.id);
    window.removeEventListener("mousemove", handleMove);
    window.removeEventListener("mouseup", handleUp);
  };

  window.addEventListener("mousemove", handleMove);
  window.addEventListener("mouseup", handleUp);
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
                      productOptions.find(opt => opt.id === activeProduct?.productType)
                        ?.viewImages[activeProduct?.color][view]
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
