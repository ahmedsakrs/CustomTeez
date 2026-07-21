import React from "react";
import { addDesignCollageToActiveView } from "../../../utils/designerUtils";

function DesignThumb({
  d,
  setActiveTab,
  imgRef,
  setSelectedDesignId,
  updateDesignsByView,
  activePreview,
}) {
  return (
    <div
      key={d.id}
      className="design-thumb"
      onClick={(e) => {
        e.stopPropagation();
        addDesignCollageToActiveView(
          d,
          imgRef,
          setSelectedDesignId,
          updateDesignsByView,
          activePreview,
        );
        setActiveTab("editDesign");
      }}
    >
      <span className="design-name">
        <img src={d.src} alt={d.name}></img>
      </span>
    </div>
  );
}

export default DesignThumb;
