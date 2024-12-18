import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Col, Row, Header } from 'react-bootstrap';
import TextImg from './components/TexttoImg/TextImg';
import CusTabs from './components/Tab';
import ImgImg from './components/ImgtoImg/ImgImg';
import VQA from './components/VQA/VQA';
import {useState} from 'react';
import ErrorBoundary from './components/debug/ErrorBoundary';

const tabs = [
  { title: 'KIS', component: <TextImg /> },
  // { title: 'Image to Image', component: <ImgImg /> },
  { title: 'VQA', component: <VQA /> }
];

const TabContent = ({ currentTab }) => {
  return <div className="tab-content">{tabs[currentTab].component}</div>;
};

function App() {
  const [currentTab, setCurrentTab] = useState(0);
  const handleTabClick = (index) => {
    setCurrentTab(index);
  };

  return (
    <Container fluid>
      <h1 className='text-center'></h1>
      <CusTabs tabs={tabs} currentTab={currentTab} onTabClick={handleTabClick} />
      <TabContent currentTab={currentTab}/>
    </Container>
  );
}

export default App;
