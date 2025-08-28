import React from "react";

function SizeLabel({size, available }) {
  return (
    <div>
      {size && available?(
        <strong className="size-label"> |{size}| </strong>
      )
      : (
        <strong className="size-label" style={{color: "lightgray"}}> |{size}| </strong>
      )}

    </div>
  );
}

export default SizeLabel;
