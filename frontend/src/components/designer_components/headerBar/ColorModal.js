import React from "react";

function ColorModal({
  setShowColorModal,
  setIsAddingProduct,
  setPendingProductType,
  productOptions,
  allProducts,
  changeProductColor,
  pendingProductType,
  activeProduct,
}) {
  if (!pendingProductType) {
    setPendingProductType(activeProduct?.productType);
  }
  return (
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
          {pendingProductType && Object.values(productOptions
            .find((opt) => opt._id === pendingProductType)
            ?.productColors).map((c) => {
              const isDuplicate = allProducts.some(
                (p) =>
                  p.productType ===
                    (pendingProductType || activeProduct?.productType) &&
                  p.color === c.color_Name,
              );
              return (
                <div
                  key={c.color_Name}
                  title={c.color_Name}
                  onClick={() => !isDuplicate && changeProductColor(c)}
                  className={`color-swatch-product ${isDuplicate ? "disabled" : ""} ${activeProduct?.color === c ? "active" : ""}`}
                  style={{ backgroundColor: c.color_RGB }}
                />
              );
            })}
        </div>
      </div>
    </div>
  );
}

export default ColorModal;
