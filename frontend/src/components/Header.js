import React from "react";
import { Navbar, Nav, Container, Row } from "react-bootstrap";
import { LinkContainer, Link } from "react-router-bootstrap";

function Header() {
  return (
    <header>
      <Navbar expand="lg" bg="dark" variant="dark" collapseOnSelect className="navbar navbar-custom">
        <Container>
          <LinkContainer to={"/"}>
            <Navbar.Brand>CustomTeez</Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav" className="navbar-custom">
            <Nav className="me-auto">
              <LinkContainer to={"/products"}>
                <Nav.Link>
                  <i className="fas fa-tshirt"></i>Products
                </Nav.Link>
              </LinkContainer>

              <LinkContainer to={"/designCategories"}>
                <Nav.Link>
                  <i className="fas fa-paint-brush"></i>Designs
                </Nav.Link>
              </LinkContainer>
            </Nav>

            <Nav className="ms-auto">
              <LinkContainer to={"/cart"}>
                <Nav.Link>
                  <i className="fas fa-shopping-cart"></i>Cart
                </Nav.Link>
              </LinkContainer>

              <LinkContainer to={"/login"}>
                <Nav.Link>
                  <i className="fas fa-user"></i>Login
                </Nav.Link>
              </LinkContainer>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
}

export default Header;
