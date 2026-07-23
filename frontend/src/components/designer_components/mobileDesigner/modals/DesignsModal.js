import React from "react";
import CategoryThumb from "../../sidebar/CategoryThumb";
import DesignThumb from "../../sidebar/DesignThumb";

function DesignsModal({
  selectedCategory,
  setSelectedCategory,
  designCategories,
  setActiveTab,
  setSelectedDesignId,
  imgRef,
  updateDesignsByView,
  activePreview,
  barRef,
}) {
  return (
    <div className="mobile-designs-modal" ref={barRef}>
      <div className="mobile-product-tabbar">
        {selectedCategory && (
          <button
            className="back-btn"
            style={{ paddingTop: "0px", width: "25px", height: "25px" }}
            onClick={() => setSelectedCategory(null)}
          >
            <i className="fas fa-angle-left" style={{ fontSize: "25px" }}>
              {" "}
            </i>
          </button>
        )}

        <h2>{selectedCategory ? selectedCategory : "Design Categories"}</h2>

        <button
          className="close-btn"
          style={{ paddingTop: "0px", width: "25px", height: "25px" }}
          onClick={() => {
            setActiveTab(null);
            setSelectedCategory(null);
          }}
        >
          <i class="fa fa-times" style={{ fontSize: "25px" }}></i>
        </button>
      </div>

      {!selectedCategory && (
        <div className="mobile-design-grid">
          {Object.keys(designCategories).map((cat) => (
            <div key={cat} className="mobile-design-card">
              <CategoryThumb
                cat={cat}
                setSelectedCategory={setSelectedCategory}
              />
            </div>
          ))}
        </div>
      )}

      {selectedCategory && (
        <div className="mobile-design-grid">
          {designCategories[selectedCategory].map((d) => (
            <div key={d.id} className="mobile-design-card">
              <DesignThumb
                d={d}
                setActiveTab={setActiveTab}
                imgRef={imgRef}
                setSelectedDesignId={setSelectedDesignId}
                updateDesignsByView={updateDesignsByView}
                activePreview={activePreview}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DesignsModal;
