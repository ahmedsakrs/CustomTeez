import React, { useState, useEffect, useRef } from "react";
import ProductModal from "./ProductModal";
import ColorModal from "./ColorModal";
import "./headerBar.css";

function HeaderBar({
  allProducts,
  setAllProducts,
  productOptions,
  activeProductId,
  setActiveProductId,
  activeProduct,
}) {
  const [showProductModal, setShowProductModal] = useState(false);
  const [showColorModal, setShowColorModal] = useState(false);
  const [pendingProductType, setPendingProductType] = useState(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const scrollRef = useRef(null);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

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

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.scrollTo({ left: el.scrollWidth, behavior: "smooth" });
    }
  }, [allProducts]); // runs every time a product is added/removed

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
    <div>
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
        <ProductModal
          setShowProductModal={setShowProductModal}
          setIsAddingProduct={setIsAddingProduct}
          setPendingProductType={setPendingProductType}
          productOptions={productOptions}
          activeProduct={activeProduct}
          changeProductType={changeProductType}
        />
      )}

      {/* Product color modal */}
      {showColorModal && (
        <ColorModal
          setShowColorModal={setShowColorModal}
          setIsAddingProduct={setIsAddingProduct}
          setPendingProductType={setPendingProductType}
          productOptions={productOptions}
          allProducts={allProducts}
          changeProductColor={changeProductColor}
          pendingProductType={pendingProductType}
          activeProduct={activeProduct}
        />
      )}
    </div>
  );
}

export default HeaderBar;
