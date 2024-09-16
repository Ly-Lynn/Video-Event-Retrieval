import React, { useEffect, useState, useCallback } from 'react';
import { Card, Row, Col, Button } from 'react-bootstrap';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import Modal from 'react-bootstrap/Modal';
import './RetrievalRes.css';
import ImgImg from '../../ImgtoImg/ImgImg';
import config from '../../config.json';
import { ButtonGroup } from '@mui/material';

function RetrievalRes(initialImages) {
  const [images, setImages] = useState(initialImages['images']);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState([]);
  const imagesPerPage = 25; // 5 rows * 5 columns

  const totalPages = Math.ceil(images.length / imagesPerPage);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const startIndex = (currentPage - 1) * imagesPerPage;
  const displayedImages = images.slice(startIndex, startIndex + imagesPerPage);

  const handleCheckboxChange = useCallback((id, checked) => {
    setSelectedIds(prev => {
      if (checked) {
        // Add the id to the end of the array if it's not already present
        return prev.includes(id) ? prev : [...prev, id];
      } else {
        // Remove the id from the array
        return prev.filter(selectedId => selectedId !== id);
      }
    });
  }, []);

  const sortImages = () => {
    const sortedImages = [
      // First, add all selected images in the order they were selected
      ...selectedIds.map(id => images.find(img => `${img.vid}${img.id}` === id)),
      // Then, add all unselected images in their original order
      ...images.filter(img => !selectedIds.includes(`${img.vid}${img.id}`))
    ].filter(Boolean); // Remove any undefined entries (shouldn't happen, but just in case)

    setImages(sortedImages);
    setCurrentPage(1);
    setSelectedIds([]);
  };

  return (
    <>
      {images.length > 0 && (
        <>
          <Stack spacing={2} alignItems="center" className="mt-3" style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row' }}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              variant="outlined"
              color="primary"
              showFirstButton
              showLastButton
            />
            <ButtonGroup>
              <Button variant='primary' onClick={sortImages} style={{ marginTop: 0, marginRight: '0.5rem' }}>Sort</Button>
              <Button variant='success' style={{ marginTop: 0 }}>Submit</Button>
            </ButtonGroup>
          </Stack>

          <DataProcessing 
            images={displayedImages} 
            onCheckboxChange={handleCheckboxChange}
            selectedIds={selectedIds}
          />
        </>
      )}
    </>
  );
}

function DataProcessing({ images, onCheckboxChange, selectedIds }) {
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

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
      <Row style={{ padding: '0.5rem' }}>
        {images.map((image, index) => {
          const imageId = `${image.vid}${image.id}`;
          const isChecked = selectedIds.includes(imageId);
          const selectionOrder = isChecked ? selectedIds.indexOf(imageId) + 1 : null;

          return (
            <Col key={index} className="mb-1 image-col" style={{ padding: '0px' }}>
              <Card>
                <div className='image-container'>
                  <input 
                    type='checkbox' 
                    data-id={imageId}
                    className='img-checkbox'
                    checked={isChecked}
                    onChange={(e) => onCheckboxChange(imageId, e.target.checked)}
                  />
                  {selectionOrder && (
                    <div className="selection-order">{selectionOrder}</div>
                  )}
                  <Card.Img className='img-style' variant="top" src={`${config.webp_db}/${image.vid}/${image.id}.webp`} />
                  <Row className='hover-container text-center' style={{ margin: 0 }}>
                    <div className='img-descript'>aa</div>
                    <Col>
                      <span className="material-symbols-outlined" onClick={() => handleImageClick(image)} style={{ cursor: 'pointer' }}>info</span>
                      <span className="material-symbols-outlined" onClick={ImgImg} style={{ cursor: 'pointer' }}>photo_library</span>
                    </Col>
                  </Row>
                </div>
              </Card>
            </Col>
          );
        })}
      </Row>

      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Body style={{ paddingTop: '0.5rem', paddingBottom: '0.5rem' }}>
          {selectedImage && (
            <Col draggable>
              <Col className='justify-content-around d-flex'>
                <div className={`text-center label label-${Math.floor(Math.random() * 5) + 1}`}>
                  {selectedImage.id}
                </div>
                <div className={`text-center label label-${Math.floor(Math.random() * 5) + 1}`}>
                  {selectedImage.vid}
                </div>
              </Col>
              <img
                src={`${config.webp_db}/${selectedImage.vid}/${selectedImage.id}.webp`}
                alt={selectedImage.info}
                style={{ width: '100%', paddingTop: '0.5rem' }}
              />
            </Col>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
}

export default RetrievalRes;