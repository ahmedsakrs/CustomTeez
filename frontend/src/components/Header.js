import React from "react";
import { Navbar, Nav, Container, Row } from "react-bootstrap";
import { LinkContainer, Link } from "react-router-bootstrap";

function Header() {
  return (
    <header>
      <Navbar expand="sm" bg="dark" variant="dark" collapseOnSelect className="navbar-custom">
        <Container fluid className="p-0">
          <LinkContainer to={"/"}>
            <Navbar.Brand>CustomTeez</Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav" className="navbar-toggle" />
          <Navbar.Collapse id="basic-navbar-nav" className="navbar-collapse">
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
