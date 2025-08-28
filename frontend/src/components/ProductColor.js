import React from "react";
import { Button } from "react-bootstrap";
import { replace, useNavigate } from "react-router-dom";

function ProductColor({ color_name, productColor, id, enabled_color }) {
  const isEnabled = enabled_color === color_name;
  let navigate = useNavigate();
  const routeChange = () => {
    let path = `/products/${id}/${color_name}`;
    navigate(path, { replace: true });
  };
  return (
    <div>
      {isEnabled ? (
        <Button
          onClick={routeChange}
          className="btn-circle-enabled"
          style={{ backgroundColor: productColor.color_RGB }}
        ></Button>
      ) : (
        <Button
          onClick={routeChange}
          className="btn-circle"
          style={{ backgroundColor: productColor.color_RGB }}
        ></Button>
      )}
    </div>
  );
}

export default ProductColor;
