import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";

const RetrievalBar = () => {
  return (
    <Container className="mb-3" style={{marginTop:7, marginBottom:5}}>
      <Row className="justify-content-around">
        <Col xs="auto">
          <Button className="btn-md" variant="outline-success">UNDO</Button>
        </Col>
        <Col xs="auto">
          <Button className="btn-md" variant="outline-danger">REDO</Button>
        </Col>
        <Col xs="auto">
          <Button className="btn-md"  variant="outline-secondary">RESET</Button>
        </Col>
      </Row>
    </Container>
  );
};

export default RetrievalBar;
