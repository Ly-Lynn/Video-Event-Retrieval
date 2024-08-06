import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';


function RetrievalRes() {
    // Gọi API lấy kết quả từ database, lưu vào images
  const images = [
    { id: 1, src: 'https://canadiangeographic.ca/wp-content/uploads/2022/08/35785844-Winters_Colours-1024x715.jpg', description: 'Description 1' },
    { id: 2, src: 'https://canadiangeographic.ca/wp-content/uploads/2022/08/35785844-Winters_Colours-1024x715.jpg', description: 'Description 2' },
  ];
  return (
    <Row>
      {images.map((image, index) => (
        <Col key={index} md={4} className="mb-3">
          <Card>
            <Card.Img variant="top" src={(image.src)} />
          </Card>
        </Col>
      ))}
    </Row>
  );
};
export default RetrievalRes;
