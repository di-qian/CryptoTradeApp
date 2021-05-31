import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer>
      <Container className="footer">
        <Row className="footer-row">
          <Col className="text-center py-4">Copyright &copy; TOKENx</Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
