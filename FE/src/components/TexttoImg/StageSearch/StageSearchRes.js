import React, { useState, useCallback } from 'react';
import { Card, Row, Col, Button } from 'react-bootstrap';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import Modal from 'react-bootstrap/Modal';
import './StageSearch.css';
// import '../RetrievalRes/RetrievalRes.css';
import ImgImg from '../../ImgtoImg/ImgImg';
import config from '../../config.json';
import { ButtonGroup, TextField } from '@mui/material';

function StageSearchRes(initialImages) {
    console.log("Initial Images: ", initialImages)
  const [images, setImages] = useState(initialImages['images']);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState([]);
  let size = images[0].length;
    let stage_css =0, col = 0;
    if ( size === 3) {
        stage_css = 3; col = 6;
    }
    else if (size === 2 ||size === 4) {
        stage_css=2; col = 8;
    }
    else if (size === 5){
        stage_css=1; col = 5;
    }

  const imagesPerPage = 5*col; // 5 rows * col columns

  const totalPages = Math.ceil(images.length / ((col/images[0].length)*5));
//   console.log("Total Pages: ", totalPages)
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [fileName, setFileName] = useState('');

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const startIndex = (currentPage - 1) * ((col/images[0].length)*5);
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
    // Flatten the 2D images array into a 1D array
    const flattenedImages = images.flat();

    // Sort the 1D array based on the selected IDs
    const sortedImages = [
        // First, add all selected images in the order they were selected
        ...selectedIds.map(id => flattenedImages.find(img => `${img.vid}${img.id}` === id)),
        // Then, add all unselected images in their original order
        ...flattenedImages.filter(img => !selectedIds.includes(`${img.vid}${img.id}`))
    ].filter(Boolean); // Remove any undefined entries (shouldn't happen, but just in case)

    // Reshape the sorted array back into its original 2D structure
    const rows = Math.ceil(sortedImages.length / images[0].length);
    const reshapedImages = Array.from({ length: rows }, (_, rowIndex) => 
        sortedImages.slice(rowIndex * images[0].length, (rowIndex + 1) * images[0].length)
    );

    setImages(reshapedImages);
    setCurrentPage(1);
    setSelectedIds([]);
};

  const handleSubmit = () => {
    setShowSubmitModal(true);
  };

  const handleModalSubmit = async () => {
    if (fileName) {

      try {
        const response = await fetch('/api/get-submission', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            file: fileName,
            data: images  
          }),
        });
        if (response.ok) {
          console.log("Saved csv successfully")
        } else {
          console.error('Error:', response.statusText);
        }
      } catch (error) {
        console.error('Error:', error);
      } 

      setShowSubmitModal(false);
      setFileName('')
    }
  }
console.log("css", stage_css)
  return (
    <>
      {images.length > 0 && (
        <>
          <Stack spacing={2} alignItems="center" className="" style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row' }}>
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
              <Button variant='success' onClick={handleSubmit} style={{ marginTop: 0 }}>Submit</Button>
            </ButtonGroup>
          </Stack>

          <DataProcessing 
            images={displayedImages} 
            onCheckboxChange={handleCheckboxChange}
            selectedIds={selectedIds}
            cssStage = {stage_css}
          />
        </>
        
      )}
      <Modal show={showSubmitModal} onHide={() => setShowSubmitModal(false)}>
            <Modal.Header>
              <Modal.Title>Enter File Name</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <TextField
            style={{ width: '450px' }}
              helperText="Please enter filename"
              id="demo-helper-text-misaligned"
              label="filename"
              onChange={(e) => setFileName(e.target.value)}
            />
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowSubmitModal(false)}>
                Close
              </Button>
              <Button variant="primary" onClick={handleModalSubmit}>
                Submit
              </Button>
            </Modal.Footer>
          </Modal>
    </>
  );
}

function DataProcessing({ images, onCheckboxChange, selectedIds, cssStage }) {
    const [showModal, setShowModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    console.log("DATA", images)
    const handleImageClick = (image) => {
        setSelectedImage(image);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedImage(null);
    };

    const getImagesPerRow = () => {
        switch (cssStage) {
            case 1:
                return 5; // 5 images per row
            case 2:
                return images[0].length % 4 === 0 ? 8 : 6; // Either 6 or 8 images per row based on group size
            case 3:
                return 6; // 6 images per row with groups of 2
            default:
                return 6; // Default to 6 if cssStage is undefined
        }
    };

    // const getGroupSize = () => {
    //     switch (cssStage) {
    //         case 1:
    //             return 5; // 1 group per row
    //         case 2:
    //             return images.length % 8 === 0 ? 4 : 3; // Groups of 3 or 4
    //         case 3:
    //             return 2; // Groups of 2
    //         default:
    //             return 3; // Default to groups of 3
    //     }
    // };

    const imagesPerRow = getImagesPerRow();
    const groupSize = images[0].length;
    const colsPerRow = imagesPerRow / groupSize; 
    const numRows = 5;
    console.log(imagesPerRow, groupSize, colsPerRow, numRows) 
    return (
        <>
<Row className='' style={{ padding: '0.5rem', justifyContent: "center" }}>
        {[...Array(numRows)].map((_, rowIndex) => {
        const startIdx = rowIndex * colsPerRow;
        const endIdx = Math.min(startIdx + colsPerRow, images.length);

        const rowGroups = images.slice(startIdx, endIdx);

        return (
            <Row key={rowIndex} style={{ marginBottom: '0.5rem' }}>
                {rowGroups.map((imgGroup, groupIndex) => (
                    <Col key={groupIndex} className='group-3' style={{ padding: '0.5rem', display: 'flex', marginLeft:"0.5rem"}}>
                        {imgGroup.map((img, imgIndex) => {
                            const imageId = `${img.vid}${img.id}`;
                            const isChecked = selectedIds.includes(imageId);
                            const selectionOrder = isChecked ? selectedIds.indexOf(imageId) + 1 : null;

                            return (
                                <Card key={imgIndex}>
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
                                        <Card.Img className='img-style' variant="top" src={`${config.webp_db}/${img.vid}/${img.id}.webp`} />
                                        <Row className='hover-container text-center' style={{ margin: 0 }}>
                                            <div className='img-descript'>aa</div>
                                            <Col>
                                                <span className="material-symbols-outlined" onClick={() => handleImageClick(img)} style={{ cursor: 'pointer' }}>info</span>
                                                <span className="material-symbols-outlined" onClick={ImgImg} style={{ cursor: 'pointer' }}>photo_library</span>
                                            </Col>
                                        </Row>
                                    </div>
                                </Card>
                            );
                        })}
                    </Col>
                ))}
            </Row>
        );
    })}
</Row>


            {/* Modal for displaying the selected image */}
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


export default StageSearchRes;