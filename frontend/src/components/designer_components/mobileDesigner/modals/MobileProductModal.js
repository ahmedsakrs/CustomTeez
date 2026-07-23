import React, { useState } from "react";
import HorizontalLine from "../../../HorizontalLine";

function MobileProductModal({
  setActiveTab,

  allProducts,
  setAllProducts,

  activeProductId,
  setActiveProductId,

  activeProduct,

  productOptions,

  barRef,
}) {
  const [mobileProductView, setMobileProductView] = useState("main");
  const [searchTerm, setSearchTerm] = useState("");
  const [pendingProductType, setPendingProductType] = useState(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);

  const deleteProduct = (id) => {
    const updated = allProducts.filter((p) => p.id !== id);
    setAllProducts(updated);
    if (id === activeProductId && updated.length > 0) {
      setActiveProductId(updated[updated.length - 1].id);
    }
  };

  const changeProductType = (newType) => {
    setPendingProductType(newType);
    setMobileProductView("selectColor");
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
    }

    setMobileProductView("main");
  };

  return (
    <div className="mobile-product-modal" ref={barRef}>
      {mobileProductView === "main" && (
        <div>
          {/* Header */}
          <div className="mobile-product-tabbar">
            <h2>Product</h2>

            <button
              className="close-btn"
              style={{ paddingTop: "0px", width: "25px", height: "25px" }}
              onClick={() => setActiveTab(null)}
            >
              <i class="fa fa-times" style={{ fontSize: "25px" }}></i>
            </button>
          </div>

          {/* Products Row */}
          <div className="mobile-products-row">
            <button
              className="mobile-add-product"
              onClick={(e) => {
                e.stopPropagation();
                setIsAddingProduct(true);
                setMobileProductView("selectProduct");
              }}
            >
              <i className="fa fa-plus" style={{ fontSize: "18px" }}></i>
            </button>

            {allProducts.map((p) => {
              return (
                <div
                  key={p.id}
                  className={`mobile-product-thumb ${
                    p.id === activeProductId ? "active" : ""
                  }`}
                  onClick={() => setActiveProductId(p.id)}
                >
                  {allProducts.length > 1 && p.id === activeProductId && (
                    <button
                      className="delete-btn"
                      style={{ width: "25px", height: "25px" }}
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteProduct(p.id);
                      }}
                    >
                      <i class="fa fa-times" style={{ fontSize: "25px" }}></i>
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
                </div>
              );
            })}
          </div>

          {/* Product Name */}
          <div className="mobile-product-name">{activeProduct?.name}</div>

          {/* Color Section */}
          <HorizontalLine marginUp={15} marginDown={15} lineColor={"#333"} />
          <div className="size-row">
            <div className="rotation-left" style={{ fontSize: "1.2rem" }}>
              Product Color
            </div>
            <div className="size-right">
              <div className="current-color">
                <button
                  onClick={() => {
                    setPendingProductType(activeProduct.productType);
                    setIsAddingProduct(false);
                    setMobileProductView("selectColor");
                  }}
                  className="font-preview"
                  style={{
                    paddingLeft: "4px",
                    paddingRight: "4px",
                    fontSize: "1rem",
                  }}
                >
                  {activeProduct?.color}
                </button>

                <button
                  onClick={() => {
                    setPendingProductType(activeProduct.productType);
                    setIsAddingProduct(false);
                    setMobileProductView("selectColor");
                  }}
                  className="color-swatch"
                  style={{
                    backgroundColor: activeProduct?.color,
                    height: "30px",
                    width: "30px",
                  }}
                />
              </div>
            </div>
          </div>

          {/* Change Product */}
          <div className="mobile-section">
            <button
              className="mobile-action-btn"
              onClick={(e) => {
                e.stopPropagation();
                setIsAddingProduct(false);
                setMobileProductView("selectProduct");
              }}
            >
              Change Product
            </button>

            {allProducts.length > 1 && (
              <button
                className="mobile-action-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteProduct(activeProductId);
                }}
              >
                Delete Product
              </button>
            )}
          </div>
        </div>
      )}

      {mobileProductView === "selectProduct" && (
        <>
          <div className="mobile-product-tabbar">
            <button
              className="back-btn"
              style={{ paddingTop: "0px", width: "25px", height: "25px" }}
              onClick={() => setMobileProductView("main")}
            >
              <i className="fas fa-angle-left" style={{ fontSize: "25px" }}>
                {" "}
              </i>
            </button>

            <h2>Select Product</h2>

            <button
              className="close-btn"
              style={{ paddingTop: "0px", width: "25px", height: "25px" }}
              onClick={() => {
                setActiveTab(null);
                setMobileProductView("main");
              }}
            >
              <i class="fa fa-times" style={{ fontSize: "25px" }}></i>
            </button>
          </div>

          <div className="mobile-product-search">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
          </div>

          <div className="mobile-product-grid">
            {productOptions
              .filter((opt) =>
                opt.name.toLowerCase().includes(searchTerm.toLowerCase()),
              )
              .map((opt) => (
                <div
                  key={opt.id}
                  className={`mobile-product-option ${
                    activeProduct?.productType === opt.id && !isAddingProduct
                      ? "active"
                      : ""
                  }`}
                  onClick={() => {
                    changeProductType(opt.id);
                  }}
                >
                  <img
                    src={opt.viewImages[opt.productColors[0]].Front}
                    alt={opt.name}
                    className="preview-image"
                  />

                  <span>{opt.name}</span>
                </div>
              ))}
          </div>
        </>
      )}

      {mobileProductView === "selectColor" && (
        <>
          <div className="mobile-product-tabbar">
            <button
              className="back-btn"
              style={{ paddingTop: "0px", width:"25px", height:"25px" }}
              onClick={() =>
                setMobileProductView(isAddingProduct ? "selectProduct" : "main")
              }
            >
              <i className="fas fa-angle-left" style={{ fontSize: "25px" }}/>
            </button>

            <h2>Select Color</h2>

            <button
              className="close-btn"
              style={{ paddingTop: "0px", width: "25px", height: "25px" }}
              onClick={() => {
                setActiveTab(null);
                setMobileProductView("main");
              }}
            >
              <i class="fa fa-times" style={{ fontSize: "25px" }}></i>
            </button>
          </div>

          <div className="mobile-color-grid">
            {productOptions
              .find(
                (opt) =>
                  opt.id === (pendingProductType || activeProduct?.productType),
              )
              ?.productColors.map((c) => {
                const isDuplicate = allProducts.some(
                  (p) =>
                    p.productType ===
                      (pendingProductType || activeProduct?.productType) &&
                    p.color === c,
                );

                return (
                  <button
                    key={c}
                    disabled={isDuplicate}
                    className={`mobile-color-swatch
                ${isDuplicate ? "disabled" : ""}
                ${activeProduct?.color === c ? "active" : ""}`}
                    style={{
                      backgroundColor: c.toLowerCase(),
                    }}
                    onClick={() => {
                      if (!isDuplicate) {
                        changeProductColor(c);
                      }
                    }}
                  />
                );
              })}
          </div>
        </>
      )}
    </div>
  );
}

export default MobileProductModal;
