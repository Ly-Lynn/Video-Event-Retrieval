import React, { useState } from 'react';
import { Card, Row, Col, Button } from 'react-bootstrap';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import Modal from 'react-bootstrap/Modal';
import './RetrievalRes.css';
import ImgImg from '../ImgtoImg/ImgImg';

function RetrievalRes() {
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const imagesPerRow = 6;
  const rowsPerPage = 5;
  const imagesPerPage = imagesPerRow * rowsPerPage;

  const images = [
    { id: 1, src: "/test_imgs/img3.png", description: 'Description 1' },
    { id: 2, src: "/test_imgs/img3.png", description: 'Description 2' },
    { id: 3, src: "/test_imgs/img3.png", description: 'Description 2' },
    { id: 4, src: "/test_imgs/img3.png", description: 'Description 2' },
    { id: 5, src: "/test_imgs/img3.png", description: 'Description 2' },
    { id: 6, src: "/test_imgs/img3.png", description: 'Description 2' },
    { id: 7, src: "/test_imgs/img3.png", description: 'Description 1' },
    { id: 8, src: "/test_imgs/img3.png", description: 'Description 2' },
    { id: 9, src: "/test_imgs/img3.png", description: 'Description 2' },
    { id: 10, src: "/test_imgs/img3.png", description: 'Description 2' },
    { id: 11, src: "/test_imgs/img3.png", description: 'Description 2' },
    { id: 12, src: "/test_imgs/img3.png", description: 'Description 2' },
    { id: 13, src: "/test_imgs/img3.png", description: 'Description 1' },
    { id: 14, src: "/test_imgs/img3.png", description: 'Description 2' },
    { id: 15, src: "/test_imgs/img3.png", description: 'Description 2' },
    { id: 16, src: "/test_imgs/img3.png", description: 'Description 2' },
    { id: 17, src: "/test_imgs/img3.png", description: 'Description 2' },
    { id: 6, src: "/test_imgs/img3.png", description: 'Description 2' },
    { id: 1, src: "/test_imgs/img3.png", description: 'Description 1' },
    { id: 2, src: "/test_imgs/img3.png", description: 'Description 2' },
    { id: 3, src: "/test_imgs/img3.png", description: 'Description 2' },
    { id: 4, src: "/test_imgs/img3.png", description: 'Description 2' },
    { id: 5, src: "/test_imgs/img3.png", description: 'Description 2' },
    { id: 6, src: "/test_imgs/img3.png", description: 'Description 2' },
    { id: 1, src: "/test_imgs/img3.png", description: 'Description 1' },
    { id: 2, src: "/test_imgs/img3.png", description: 'Description 2' },
    { id: 3, src: "/test_imgs/img3.png", description: 'Description 2' },
    { id: 4, src: "/test_imgs/img3.png", description: 'Description 2' },
    { id: 5, src: "/test_imgs/img3.png", description: 'Description 2' },
    { id: 6, src: "/test_imgs/img3.png", description: 'Description 2' },
    { id: 2, src: "/test_imgs/img3.png", description: 'Description 2' },
    { id: 3, src: "/test_imgs/img3.png", description: 'Description 2' },
    { id: 4, src: "/test_imgs/img3.png", description: 'Description 2' },
    { id: 5, src: "/test_imgs/img3.png", description: 'Description 2' },
    { id: 6, src: "/test_imgs/img3.png", description: 'Description 2' },
    { id: 1, src: "/test_imgs/img3.png", description: 'Description 1' },
    { id: 2, src: "/test_imgs/img3.png", description: 'Description 2' },
    { id: 3, src: "/test_imgs/img3.png", description: 'Description 2' },
    { id: 4, src: "/test_imgs/img3.png", description: 'Description 2' },
    { id: 5, src: "/test_imgs/img3.png", description: 'Description 2' },
    { id: 6, src: "/test_imgs/img3.png", description: 'Description 2' }
  ];

  const totalPages = Math.ceil(images.length / imagesPerPage);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const startIndex = (currentPage - 1) * imagesPerPage;
  const selectedImages = images.slice(startIndex, startIndex + imagesPerPage);

  const handleImageClick = (image) => {
    setSelectedImage(image);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedImage(null);
  };

  return (
    <>
      <Stack spacing={2} alignItems="center" className="mt-3">
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          variant="outlined"
          color='primary'
          showFirstButton 
          showLastButton
        />
      </Stack>

      <Row style={{padding: '0.5rem'}}>
        {selectedImages.map((image, index) => (
          <Col key={index} md={2} className="mb-1" style={{padding: '0px'}}>
            <Card>
              <div className='image-container'>
                <div className='img-id text-center'>Frame ID: {image.id}</div>
                <Card.Img variant="top" src={image.src} style={{ maxWidth: '300px', height: 'auto', objectFit: 'cover' }} />
                  <Row className='hover-container text-center' style={{marginLeft:0}}>
                    <div className='img-descript'>{image.description}</div>
                    <Col>
                      <span class="material-symbols-outlined" onClick={() => handleImageClick(image)} style={{cursor:'pointer'}}>info</span> 
                      <span class="material-symbols-outlined" onClick={ImgImg} style={{cursor:'pointer'}}>photo_library</span>
                    </Col>
                  </Row>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Body style={{paddingTop:0, paddingBottom:0}}>
          {selectedImage && (
            <Col>
              <div className='text-center' style={{fontSize:'1.5rem', fontWeight:'bold'}}>Frame ID: {selectedImage.id}</div>
              <img
                src={selectedImage.src}
                alt={selectedImage.description}
                style={{ width: '100%' }}
              />
              <div className='text-center' style={{fontSize:'1.2rem'}}>{selectedImage.description}</div>
            </Col>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
}

export default RetrievalRes;
