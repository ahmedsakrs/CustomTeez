import React from "react";

function DesignThumb({d, addDesignCollageToActiveView, setActiveTab}) {
  return (
    <div
      key={d.id}
      className="design-thumb"
      onClick={() => {
        addDesignCollageToActiveView(d);
        setActiveTab(null);
      }}
    >
      <span className="design-name">
        <img src={d.src} alt={d.name}></img>
      </span>
    </div>
  );
}

export default DesignThumb;
