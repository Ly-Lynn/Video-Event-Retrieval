import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import RetrievalBar from './components/retrievalBar';
import RetrievalRes from './components/retrievalResult';
import { Container, Col, Row, Header } from 'react-bootstrap';
import SearchOption from './components/SearchOption';

function App() {
  return (
    <Container fluid>
      <h1 className='text-center '>Video Retrieval</h1>
      <Row  style={{margin:10}}>
        <Col className='border' md={4} >
          {/* <RetrievalBar/> */}
          <SearchOption/>
        </Col>
        <Col className='border' md={8}>
          <RetrievalRes/>
        </Col>
      </Row>
    </Container>
  );
}

export default App;
