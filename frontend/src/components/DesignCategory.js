import React from "react";
import { Card } from "react-bootstrap";
// import Rating from './Rating'
import {Link} from 'react-router-dom'

function DesignCategory({ design_category }) {
  return (
    <Card className="my-3 p-3 rounded">
      <Link to={`./${design_category._id}`}>
        <Card.Img src={design_category.image} />
      </Link>

      <Card.Body>
        <Link to={`./${design_category._id}`}>
          <Card.Title as="div">
            <strong>{design_category.name}</strong>
          </Card.Title>
        </Link>

      </Card.Body>
    </Card>
  );
}

export default DesignCategory;
