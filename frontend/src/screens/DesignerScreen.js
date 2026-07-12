import React, { useState, useRef, useEffect } from "react";
import { Rnd } from "react-rnd";
import "./ProductDesigner.css"; // responsive styles
import Sidebar from "../components/designer_components/sidebar/Sidebar";
import {
  checkAfterRotation,
  handleToggleAspectLock,
  updateSizeClamped,
} from "../utils/designerUtils";

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
          src: "/designs/yashfiny.png",
          x: 0.4,
          y: 0.5,
          width: 0.2,
          height: 0.2,
        },
        {
          id: "element-4",
          src: "/designs/vinyl.jpg",
          x: 0.6,
          y: 0.5,
          width: 0.15,
          height: 0.15,
        },
        {
          id: "element-5",
          src: "/designs/star.png",
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

  const [isWidthBlank, setIsWidthBlank] = useState(false);
  const [isHeightBlank, setIsHeightBlank] = useState(false);
  const [isWidthZero, setIsWidthZero] = useState(false);
  const [isHeightZero, setIsHeightZero] = useState(false);
  const [isCropping, setIsCropping] = useState(false);
  const [activePreview, setActivePreview] = useState("Front");
  const [showProductModal, setShowProductModal] = useState(false);
  const [showColorModal, setShowColorModal] = useState(false);
  const [activeTab, setActiveTab] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [pendingProductType, setPendingProductType] = useState(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [selectedDesignId, setSelectedDesignId] = useState(null);
  const [isRotating, setIsRotating] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [lockedWrapperPos, setLockedWrapperPos] = useState(null);
  const [lockedDesignId, setLockedDesignId] = useState(null);
  const [regionWidth, setRegionWidth] = useState(0);
  const [regionHeight, setRegionHeight] = useState(0);
  const [justFinishedInteraction, setJustFinishedInteraction] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [pendingText, setPendingText] = useState("");
  const [thumbSizes, setThumbSizes] = useState({
    Front: { w: 0, h: 0 },
    Back: { w: 0, h: 0 },
    "L Sleeve": { w: 0, h: 0 },
    "R Sleeve": { w: 0, h: 0 },
  });

  const previewRef = useRef(null);
  const imgRef = useRef(null);
  const panelRef = useRef(null);
  const barRef = useRef(null);
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

        if (barRef.current && barRef.current.contains(e.target)) {
          return;
        }

        if (justFinishedInteraction) {
          // Suppress deselect once
          setJustFinishedInteraction(false);
          return;
        }

        if (isActive) return;

        if (isResizing || isRotating) return;
        setActiveTab("");
        setSelectedDesignId(null);
        setIsCropping(false);
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

  const getThumbRegionSize = (view) => {
    let width =
      (productOptions.find((opt) => opt.id === activeProduct?.productType)
        ?.viewRegions[view].xEnd -
        productOptions.find((opt) => opt.id === activeProduct?.productType)
          ?.viewRegions[view].xStart) *
      thumbSizes[view].w;
    let height =
      (productOptions.find((opt) => opt.id === activeProduct?.productType)
        ?.viewRegions[view].yEnd -
        productOptions.find((opt) => opt.id === activeProduct?.productType)
          ?.viewRegions[view].yStart) *
      thumbSizes[view].h;
    return { w: width, h: height };
  };

  const filteredOptions = productOptions.filter((opt) =>
    opt.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

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

  const selectedDesign = designsByView[activePreview].find(
    (d) => d.id === selectedDesignId,
  );

  return (
    <div className="designer-container">
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        designCategories={designCategories}
        panelRef={panelRef}
        imgRef={imgRef}
        barRef={barRef}
        designsByView={designsByView}
        setDesignsByView={setDesignsByView}
        activePreview={activePreview}
        selectedDesignId={selectedDesignId}
        setSelectedDesignId={setSelectedDesignId}
        getBoundingBox={getBoundingBox}
        regionWidth={regionWidth}
        regionHeight={regionHeight}
        isCropping={isCropping}
        setIsCropping={setIsCropping}
        isHeightZero={isHeightZero}
        setIsHeightZero={setIsHeightZero}
        isHeightBlank={isHeightBlank}
        setIsHeightBlank={setIsHeightBlank}
        isWidthZero={isWidthZero}
        setIsWidthZero={setIsWidthZero}
        isWidthBlank={isWidthBlank}
        setIsWidthBlank={setIsWidthBlank}
        pendingText={pendingText}
        setPendingText={setPendingText}
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
                      <i class="fa fa-times"></i>
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
                <i class="fa fa-times"></i>
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
                <i class="fa fa-times"></i>
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
                        className={`color-swatch-product ${isDuplicate ? "disabled" : ""} ${activeProduct?.color === c ? "active" : ""}`}
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
                  border: isActive ? "1.5px dashed #333" : "none",
                  backgroundColor: isActive
                    ? "rgba(0,0,0,0.05)"
                    : "transparent",
                };

                return (
                  <div style={style}>
                    {selectedDesignId != null &&
                      isActive &&
                      Math.abs(
                        selectedDesign.x + selectedDesign.width / 2 - 1 / 2,
                      ) <
                        1 / 35 && (
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
                            : { x: d.x * regionWidth, y: d.y * regionHeight }
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

                          const widthPx = d.width * regionWidth;

                          const centerX = newX + widthPx / 2;
                          const regionCenterX = regionWidth / 2;
                          const threshold = regionWidth / 20;

                          // ✅ SNAP
                          if (Math.abs(centerX - regionCenterX) < threshold) {
                            newX = regionCenterX - widthPx / 2;

                            // ✅ KEY FIX: override Rnd internal position
                            data.x = newX;
                          }

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
                              width:
                                d.width * Math.min(regionWidth, regionHeight),
                              height:
                                d.height * Math.min(regionWidth, regionHeight),
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
                              <i
                                class="bi bi-x"
                                style={{ fontSize: "24px" }}
                              ></i>
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
                                    [activePreview]: prev[activePreview].map(
                                      (item) =>
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

                                  window.removeEventListener(
                                    "pointermove",
                                    handleMove,
                                  );
                                  window.removeEventListener(
                                    "pointerup",
                                    handleUp,
                                  );
                                };

                                window.addEventListener(
                                  "pointermove",
                                  handleMove,
                                );
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

                                  window.removeEventListener(
                                    "pointermove",
                                    handleMove,
                                  );
                                  window.removeEventListener(
                                    "pointerup",
                                    handleUp,
                                  );
                                };

                                window.addEventListener(
                                  "pointermove",
                                  handleMove,
                                );
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
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDesigner;
