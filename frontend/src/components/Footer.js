import React from 'react'
import {Container, Row, Col} from "react-bootstrap";

function Footer() {
  return (
      <footer>
          <Container>
            <Row>
              <Col className='text-center py-3'>
                &copy; 2024 Magnolia Teez LLC
              </Col>
            </Row>
          </Container>
      </footer>
  )
}

export default Footer
