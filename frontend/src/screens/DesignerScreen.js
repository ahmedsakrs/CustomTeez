import React, { useState, useRef } from "react";
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
      Front: { xStart: 0.25, yStart: 0.3, xEnd: 0.75, yEnd: 0.7 },
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

  // Ref for preview container to calculate bounds correctly
  const previewRef = useRef(null);

  const activeProduct = allProducts.find(p => p.id === activeProductId);

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
    let initX = 50, initY = 50;

    if (previewRef.current && region) {
      const w = previewRef.current.offsetWidth;
      const h = previewRef.current.offsetHeight;
      initX = region.xStart * w + ((region.xEnd - region.xStart) * w) / 2 - 50;
      initY = region.yStart * h + ((region.yEnd - region.yStart) * h) / 2 - 50;
    }

    setDesignsByView(prev => ({
      ...prev,
      [activePreview]: [
        ...prev[activePreview],
        { ...newDesign, x: initX, y: initY, width: 100, height: 100 }
      ]
    }));
  };

  return (
    <div className="designer-container">
      {/* Left tab panel */}
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
      {/* Right side content */}
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
                  src={
                    productOptions.find(opt => opt.id === activeProduct?.productType)
                      ?.viewImages[activeProduct?.color][activePreview]
                  }
                  alt={`${activeProduct?.name} ${activePreview}`}
                  className="preview-image"
                />

                {/* Region overlay for active preview */}
                {(() => {
                  const product = productOptions.find(opt => opt.id === activeProduct?.productType);
                  const region = product?.viewRegions[activePreview];
                  if (!previewRef.current || !region) return null;

                  const w = previewRef.current.offsetWidth;
                  const h = previewRef.current.offsetHeight;
                  const style = {
                    position: "absolute",
                    left: region.xStart * w,
                    top: region.yStart * h,
                    width: (region.xEnd - region.xStart) * w,
                    height: (region.yEnd - region.yStart) * h,
                    overflow: "visible"
                  };

                  return (
                    <div style={style}>
                      {designsByView[activePreview].map(d => (
                        <Rnd
                          key={d.id}
                          size={{ width: d.width, height: d.height }}
                          position={{ x: d.x, y: d.y }}
                          bounds="parent"   // constrained to region overlay
                          onDragStop={(e, data) => {
                            setDesignsByView(prev => ({
                              ...prev,
                              [activePreview]: prev[activePreview].map(item =>
                                item.id === d.id ? { ...item, x: data.x, y: data.y } : item
                              )
                            }));
                          }}
                          onResizeStop={(e, direction, ref, delta, position) => {
                            setDesignsByView(prev => ({
                              ...prev,
                              [activePreview]: prev[activePreview].map(item =>
                                item.id === d.id
                                  ? {
                                      ...item,
                                      width: ref.offsetWidth,
                                      height: ref.offsetHeight,
                                      x: position.x,
                                      y: position.y
                                    }
                                  : item
                              )
                            }));
                          }}
                        >
                          <div className="design-wrapper">
                            {d.src ? (
                              <img src={d.src} alt={d.name} className="preview-image" />
                            ) : (
                              <div style={{ fontSize: "2rem", fontWeight: "bold", color: designColor }}>
                                {d.text}
                              </div>
                            )}
                            <button
                              className="delete-btn"
                              onClick={() => {
                                setDesignsByView(prev => ({
                                  ...prev,
                                  [activePreview]: prev[activePreview].filter(item => item.id !== d.id)
                                }));
                              }}
                            >
                              ✖
                            </button>
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
