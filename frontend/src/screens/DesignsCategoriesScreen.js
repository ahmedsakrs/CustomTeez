import React, { useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import DesignCategory from "../components/DesignCategory";
import { useDispatch, useSelector } from "react-redux";
import { listCategory } from "../actions/designActions";
import Loader from "../components/Loader";
import Message from "../components/Message";

function DesignsCategoriesScreen() {
  const dispatch = useDispatch();
  const categoriesList = useSelector((state) => state.categoryList);
  const { loading, error, categories } = categoriesList;

  useEffect(() => {
    dispatch(listCategory());
  }, [dispatch]);
  return (
    <div>
      <h1>Design Categories</h1>
      {loading ? (
        <h2>
          <Loader />
        </h2>
      ) : error ? (
        <Message variant={"danger"}>{error}</Message>
      ) : (
        <Row>
          {categories.map((category) => (
            <Col key={category._id} sm={12} md={6} lg={4} xl={3}>
              <DesignCategory design_category={category} />
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}

export default DesignsCategoriesScreen;
