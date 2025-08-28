import React from "react";
import { Link } from "react-router-dom";
import { Button, Card } from "react-bootstrap";

function DesignCard({ design }) {
  return (
    <div>
      <Card className="my-3 p-3 rounded">

        <Card.Img src={design.image} />

        <Card.Body>
          <Card.Title as="div">
            <strong>{design._id}</strong>
          </Card.Title>

          <Link>
            <Button
              className="start-design-btn"
              variant="primary"
            > Customize Design {" "}
            </Button>
          </Link>
        </Card.Body>
      </Card>
    </div>
  );
}

export default DesignCard;
