import React from "react";
import SearchOption from "./SearchOption";
import RetrievalRes from "./retrievalResult";
import { Row, Col } from "react-bootstrap";
function TextImg () {
    return (
        <Row  style={{margin:10}}>
            <Col className='border' md={4} >
            {/* <RetrievalBar/> */}
            <SearchOption/>
            </Col>
            <Col className='border' md={8}>
            <RetrievalRes/>
            </Col>
        </Row>
    )
}

export default TextImg;