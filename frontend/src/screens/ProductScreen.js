import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Row, Col, Button, Container } from "react-bootstrap";
import ProductColor from "../components/ProductColor";
import ProductImageGallery from "../components/ProductImageGallery";
import { useDispatch, useSelector } from "react-redux";
import { listProductDetails } from "../actions/productActions";
import Loader from "../components/Loader";
import Message from "../components/Message";
import SizeLabel from "../components/SizeLabel";
import AccordionProduct from "../components/AccordionProduct";

function ProductScreen() {
  const productDetails = useSelector((state) => state.productDetails);

  const dispatch = useDispatch();
  const params = useParams();
  const color = params.color;
  const { loading, error, product } = productDetails;

  useEffect(() => {
    dispatch(listProductDetails(params.id));
  }, [dispatch, params.id]);

  return (
    <div>
      {loading ? (
        <h2>
          <Loader />
        </h2>
      ) : error ? (
        <Message variant={"danger"}>{error}</Message>
      ) : params.color &&
        product.colors &&
        !product.colors.hasOwnProperty(params.color) ? (
        <Message variant={"danger"}>{"This product does not exist"}</Message>
      ) : product.show ? (
        <div>
          <Link to="/products" className="btn btn-light my-3">
            Go To Products{" "}
          </Link>
          <Row>
            {params.color ? (
              <Col md={6}>
                <ProductImageGallery
                  key={params.color}
                  images={
                    product.images &&
                    Object.values(product.colors[color].images).concat(
                      product.images
                    )
                  }
                  colorIndex={true}
                />
              </Col>
            ) : (
              <Col md={6}>
                <ProductImageGallery
                  images={product.images}
                  key={params.color}
                />
              </Col>
            )}

            <Col md={6}>
              <Container>
                {product.colors && "Available Colors:"}
                <Row>
                  {product.colors &&
                    Object.keys(product.colors).map((productColor) => (
                      <Col key={productColor} sm={8} md={6} lg={4} xl={1}>
                        <ProductColor
                          color_name={productColor}
                          productColor={product.colors[productColor]}
                          id={params.id}
                          enabled_color={params.color}
                        />
                      </Col>
                    ))}
                </Row>
              </Container>

              <br></br>
              <Container>
              {product.colors &&
                product.colors[params.color] &&
                product.colors[params.color].sizes &&
                "Available Sizes:"}
                <Row>
                  {product.colors &&
                    product.colors[params.color] &&
                    product.colors[params.color].sizes &&
                    Object.keys(product.colors[params.color].sizes).map(
                      (productSize) => (
                        <Col key={productSize} sm={6} md={4} lg={2} xl={1}>
                          <SizeLabel
                            color={params.color}
                            size={productSize}
                            available={
                              product.colors[params.color].sizes[productSize].availableInStock
                            }
                          />
                        </Col>
                      )
                    )}
                </Row>
              </Container>

              {product.colors && (
                <Link to={'/designer'}>
                <Button
                  className="start-design-btn"
                  variant="primary"
                  disabled={!params.color}
                >
                  {params.color
                    ? "Customize Product"
                    : "Choose Product Color to Customize"}
                </Button>
                </Link>
                
              )}

              <AccordionProduct
                price={product.price}
                description={product.description}
                details={"details"}
              />
            </Col>
          </Row>
        </div>
      ) : (
        <Message variant={"danger"}>
          {"This product does not exist anymore"}
        </Message>
      )}
    </div>
  );
}

export default ProductScreen;
