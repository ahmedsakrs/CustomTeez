import React, { useState } from "react";
import { Carousel, Image, Row, Col } from "react-bootstrap";

const ProductImageGallery = ({ images }) => {
  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  return (
    <>
      <Row>
        <Col xs={2}>
        {images && images.map((image, idx) => (
          <Row key={idx}>
            <Image
              src={image}
              thumbnail
              onClick={() => handleSelect(idx)}
              style={{ cursor: "pointer" }}
            />
          </Row>
        ))}
        </Col>
        <Col xs={10}>
        <Carousel className="carousel-dark" activeIndex={index} onSelect={handleSelect} interval={null}>
            {images && images.map((image, idx) => (
              <Carousel.Item key={idx}>
                <img
                  className="d-block w-100"
                  src={image}
                  alt={`Product ${idx + 1}`}
                  style={{background: "black"}}
                />
              </Carousel.Item>
            ))}
          </Carousel>
        </Col>
      </Row>
    </>
  );
};

export default ProductImageGallery;
