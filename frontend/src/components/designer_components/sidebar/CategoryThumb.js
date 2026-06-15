import React from "react";

function CategoryThumb({cat, setSelectedCategory}) {
  return (
    <div
      key={cat}
      className="cat-thumb"
      onClick={() => setSelectedCategory(cat)}
    >
      {cat}
    </div>
  );
}

export default CategoryThumb;
