import React from 'react'
import { Carousel } from 'react-bootstrap';

function ProductImages({images}) {
    return (
        <Carousel>
          {images.map((image, index) => (
            <Carousel.Item key={index}>
              <img
                className="d-block w-100"
                src={image}
                alt={`Product image ${index + 1}`}
              />
            </Carousel.Item>
          ))}
        </Carousel>
    )
}

export default ProductImages
