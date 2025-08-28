import React, { useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { listDesigns } from "../actions/designActions";
import Loader from "../components/Loader";
import Message from "../components/Message";
import DesignCard from "../components/DesignCard";

function DesignCategoryScreen() {
  const designsList = useSelector((state) => state.designList);

  const dispatch = useDispatch();
  const params = useParams();
  const { loading, error, designs } = designsList;

  useEffect(() => {
    dispatch(listDesigns(params.categoryID));
  }, [dispatch, params.categoryID]);
  return (
    <div>
      <h1>Designs</h1>
      {loading ? (
        <h2>
          <Loader />
        </h2>
      ) : error ? (
        <Message variant={"danger"}>{error}</Message>
      ) : (
        <Row>
          {designs.map((design) => (
            <Col key={design._id} sm={12} md={6} lg={4} xl={3}>
              <DesignCard design={design} />
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}

export default DesignCategoryScreen;
