import React, {useState} from "react";

function ProductModal({
  setShowProductModal,
  setIsAddingProduct,
  setPendingProductType,
  productOptions,
  activeProduct,
  changeProductType
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const filteredOptions = productOptions.filter((opt) =>
    opt.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );
  return (
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
  );
}

export default ProductModal;
