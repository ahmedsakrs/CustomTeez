import React from "react";
import { Accordion } from "react-bootstrap";

function AccordionProduct({ price, description, details }) {
  return (
    <Accordion defaultActiveKey="0" className="mt-3">
      <Accordion.Item eventKey="0" className="item">
        <Accordion.Header>
            Product Price
        </Accordion.Header>

        <Accordion.Body>
          Price: <strong>${price}</strong> <br></br>For the product with the
          design in the front <strong>or</strong> the back.
          <br></br>
          <strong>$5</strong> extra for the back and the front.
        </Accordion.Body>
      </Accordion.Item>

      <Accordion.Item eventKey="2" className="item">
        <Accordion.Header>
            Product Description
        </Accordion.Header>

        <Accordion.Body>
          {description}
        </Accordion.Body>
      </Accordion.Item>

      <Accordion.Item eventKey="3" className="item">
        <Accordion.Header>
            Product Details
        </Accordion.Header>

        <Accordion.Body>
          {details}
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
}

export default AccordionProduct;
