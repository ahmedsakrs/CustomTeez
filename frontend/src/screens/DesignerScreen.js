import React, { useState, useRef, useEffect, useCallback } from "react";
import "../components/designer_components/mainArea/mainArea.css"; // responsive styles
import Sidebar from "../components/designer_components/sidebar/Sidebar";
import HeaderBar from "../components/designer_components/headerBar/HeaderBar";
import ActivePreview from "../components/designer_components/mainArea/ActivePreview";
import ViewThumbnails from "../components/designer_components/mainArea/ViewThumbnails";
import MobileDesigner from "../components/designer_components/mobileDesigner/MobileDesigner";

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
      Front: { xStart: 0.2, yStart: 0.2, xEnd: 0.7, yEnd: 0.8 },
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

function DesignerScreen() {
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
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  const [isWidthBlank, setIsWidthBlank] = useState(false);
  const [isHeightBlank, setIsHeightBlank] = useState(false);
  const [isWidthZero, setIsWidthZero] = useState(false);
  const [isHeightZero, setIsHeightZero] = useState(false);
  const [isCropping, setIsCropping] = useState(false);
  const [activePreview, setActivePreview] = useState("Front");
  const [activeTab, setActiveTab] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [selectedDesignId, setSelectedDesignId] = useState(null);
  const [regionWidth, setRegionWidth] = useState(0);
  const [regionHeight, setRegionHeight] = useState(0);
  const [isRotating, setIsRotating] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [justFinishedInteraction, setJustFinishedInteraction] = useState(false);
  const [pendingText, setPendingText] = useState("");
  const [contextMenu, setContextMenu] = useState(null);

  const [showProductModal, setShowProductModal] = useState(false);
  const [showColorModal, setShowColorModal] = useState(false);
  const [isAddingProduct, setIsAddingProduct] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState(null);

  const imgRef = useRef(null);
  const panelRef = useRef(null);
  const sideRef = useRef(null);
  const barRef = useRef(null);

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

        if (sideRef.current && sideRef.current.contains(e.target)) {
          return;
        }

        if (justFinishedInteraction) {
          // Suppress deselect once
          setJustFinishedInteraction(false);
          return;
        }

        if (
          e.target.closest(".bounding-box-overlay") ||
          e.target.closest(".design-container") ||
          e.target.closest(".control-btn") ||
          e.target.closest(".designer-context-menu")
        ) {
          return;
        }

        if (isActive) return;

        if (isResizing || isRotating) return;
        setActiveTab(null);
        setSelectedDesignId(null);
        setIsCropping(false);
        setContextMenu(null);
      };
      // window.addEventListener("click", handleClickOutside);
      window.addEventListener("mousedown", handleClickOutside);
      return () => {
        // window.removeEventListener("click", handleClickOutside);
        window.removeEventListener("mousedown", handleClickOutside);
      };
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
    const designs = designsByView[activePreview] || [];

    if (selectedDesignId && !designs.some((d) => d.id === selectedDesignId)) {
      setSelectedDesignId(null);
    }
  }, [designsByView, activePreview, selectedDesignId]);

  function getBoundingBox(w, h, angle) {
    const cos = Math.abs(Math.cos(angle));
    const sin = Math.abs(Math.sin(angle));
    return {
      width: w * cos + h * sin,
      height: w * sin + h * cos,
    };
  }

  const pushHistory = (currentDesigns, currentSelectedDesignId) => {
    setUndoStack((prev) => [
      ...prev,
      {
        designsByView: structuredClone(currentDesigns),
        selectedDesignId: currentSelectedDesignId,
      },
    ]);

    setRedoStack([]);
  };

  const updateDesignsByView = (updater) => {
    setDesignsByView((current) => {
      pushHistory(current, selectedDesignId);

      return typeof updater === "function" ? updater(current) : updater;
    });
  };

  const undo = useCallback(() => {
    if (!undoStack.length) return;

    const previous = undoStack[undoStack.length - 1];

    setRedoStack((redo) => [
      ...redo,
      {
        designsByView: structuredClone(designsByView),
        selectedDesignId,
      },
    ]);

    setDesignsByView(previous.designsByView);

    // setSelectedDesignId(previous.selectedDesignId);
    if (previous.selectedDesignId === null) {
      setActiveTab(null);
    }

    setUndoStack((prev) => prev.slice(0, -1));
  }, [undoStack, designsByView, selectedDesignId]);

  const redo = useCallback(() => {
    if (!redoStack.length) return;

    const next = redoStack[redoStack.length - 1];

    setUndoStack((undo) => [
      ...undo,
      {
        designsByView: structuredClone(designsByView),
        selectedDesignId,
      },
    ]);

    setDesignsByView(next.designsByView);

    // setSelectedDesignId(next.selectedDesignId);

    setRedoStack((prev) => prev.slice(0, -1));
  }, [redoStack, designsByView, selectedDesignId]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const target = e.target;

      const isTyping =
        target instanceof HTMLElement &&
        ((target.tagName === "INPUT" && target.className !== "slider") ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);

      if (isTyping) {
        return;
      }
      const ctrl = e.ctrlKey || e.metaKey;

      if (ctrl && e.key.toLowerCase() === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
      }

      if (
        ctrl &&
        (e.key.toLowerCase() === "y" ||
          (e.key.toLowerCase() === "z" && e.shiftKey))
      ) {
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [undo, redo]);

  const MOBILE_QUERY = "(max-width: 720px)";

  const [isMobile, setIsMobile] = useState(
    window.matchMedia(MOBILE_QUERY).matches,
  );

  useEffect(() => {
    const media = window.matchMedia(MOBILE_QUERY);

    const handler = (e) => {
      setIsMobile(e.matches);
    };

    media.addEventListener("change", handler);

    return () => {
      media.removeEventListener("change", handler);
    };
  }, []);

  return !isMobile ? (
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
        sideRef={sideRef}
        updateDesignsByView={updateDesignsByView}
        undo={undo}
        redo={redo}
        canUndo={undoStack.length > 0}
        canRedo={redoStack.length > 0}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        onClick={(e) => {
          e.stopPropagation();
        }}
      />

      {/* Main content */}
      <div className="main-content">
        <HeaderBar
          allProducts={allProducts}
          setAllProducts={setAllProducts}
          productOptions={productOptions}
          activeProductId={activeProductId}
          setActiveProductId={setActiveProductId}
          activeProduct={activeProduct}
          showColorModal={showColorModal}
          showProductModal={showProductModal}
          setShowColorModal={setShowColorModal}
          setShowProductModal={setShowProductModal}
          isAddingProduct={isAddingProduct}
          setIsAddingProduct={setIsAddingProduct}
        />

        {/* Right preview area */}
        <div className="preview-area">
          <div className="preview-grid">
            {/* Column 1: Active preview */}
            <ActivePreview
              imgRef={imgRef}
              productOptions={productOptions}
              regionWidth={regionWidth}
              regionHeight={regionHeight}
              setRegionWidth={setRegionWidth}
              setRegionHeight={setRegionHeight}
              activeProduct={activeProduct}
              designsByView={designsByView}
              setDesignsByView={setDesignsByView}
              activePreview={activePreview}
              isRotating={isRotating}
              isResizing={isResizing}
              setIsActive={setIsActive}
              setIsWidthBlank={setIsWidthBlank}
              setIsWidthZero={setIsWidthZero}
              setIsHeightBlank={setIsHeightBlank}
              setIsHeightZero={setIsHeightZero}
              setSelectedDesignId={setSelectedDesignId}
              setActiveTab={setActiveTab}
              setPendingText={setPendingText}
              getBoundingBox={getBoundingBox}
              setJustFinishedInteraction={setJustFinishedInteraction}
              isActive={isActive}
              selectedDesignId={selectedDesignId}
              setIsRotating={setIsRotating}
              setIsResizing={setIsResizing}
              updateDesignsByView={updateDesignsByView}
              contextMenu={contextMenu}
              setContextMenu={setContextMenu}
              isMobile={false}
            />
            {/* Column 2: Thumbnails stacked */}
            <ViewThumbnails
              activePreview={activePreview}
              setActivePreview={setActivePreview}
              productOptions={productOptions}
              activeProduct={activeProduct}
              getBoundingBox={getBoundingBox}
              designsByView={designsByView}
            />
          </div>
        </div>
      </div>
    </div>
  ) : (
    <MobileDesigner
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      activePreview={activePreview}
      setActivePreview={setActivePreview}
      selectedDesignId={selectedDesignId}
      setSelectedDesignId={setSelectedDesignId}
      productOptions={productOptions}
      activeProduct={activeProduct}
      imgRef={imgRef}
      regionWidth={regionWidth}
      regionHeight={regionHeight}
      setRegionWidth={setRegionWidth}
      setRegionHeight={setRegionHeight}
      designsByView={designsByView}
      setDesignsByView={setDesignsByView}
      isRotating={isRotating}
      isResizing={isResizing}
      setIsActive={setIsActive}
      setIsWidthBlank={setIsWidthBlank}
      setIsWidthZero={setIsWidthZero}
      setIsHeightBlank={setIsHeightBlank}
      setIsHeightZero={setIsHeightZero}
      pendingText={pendingText}
      setPendingText={setPendingText}
      getBoundingBox={getBoundingBox}
      setJustFinishedInteraction={setJustFinishedInteraction}
      isActive={isActive}
      setIsRotating={setIsRotating}
      setIsResizing={setIsResizing}
      setIsCropping={setIsCropping}
      isCropping={isCropping}
      designCategories={designCategories}
      panelRef={panelRef}
      updateDesignsByView={updateDesignsByView}
      allProducts={allProducts}
      setAllProducts={setAllProducts}
      activeProductId={activeProductId}
      setActiveProductId={setActiveProductId}
      contextMenu={contextMenu}
      setContextMenu={setContextMenu}
      showColorModal={showColorModal}
      setShowColorModal={setShowColorModal}
      showProductModal={showProductModal}
      setShowProductModal={setShowProductModal}
      setIsAddingProduct={setIsAddingProduct}
      barRef={barRef}
      selectedCategory={selectedCategory}
      setSelectedCategory={setSelectedCategory}
      sideRef={sideRef}
    />
  );
}

export default DesignerScreen;
