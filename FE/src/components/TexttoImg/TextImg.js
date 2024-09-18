import React, { useState, useEffect } from "react";
import { Navbar, Nav, Row, Col } from "react-bootstrap";
import SearchOption from "./SearchOption";
import RetrievalRes from "./RetrievalRes/retrievalResult";
import ErrorBoundary from "../debug/ErrorBoundary";
import StageSearch from "./StageSearch/StageSearch";
import StageSearchRes from "./StageSearch/StageSearchRes";

function TextImg() {
  const [value, setValue] = useState(0);
  const [tabList, setTabList] = useState([{ key: 0, id: 0 }]);
  const [tabData, setTabData] = useState({
      0: {
        selectedOption: 0,
        textareaValues: {},
        weights: { OCR: 50, ASR: 50, OD: 50 },
        selectedObject: '',
        results: [],
        reset: false,
      },
    });
  
  const [stageResults, setStageResults] = useState([]);
  const [showStageSearch, setShowStageSearch] = useState(false);
  const [stageConfirm, setStageConfirm] = useState(false);
  const [singleRes, setSingleRes] = useState([]);

  useEffect(() => {
    setShowStageSearch(tabList.length > 1);
  }, [tabList]);


    const addTab = () => {
      setTabList((prevTabList) => {
        const id = prevTabList.length > 0 ? prevTabList[prevTabList.length - 1].id + 1 : 0;
        return [...prevTabList, { key: id, id: id }];
      });
    
      const newTabId = tabList.length;
    
      setTabData((prevTabData) => ({
        ...prevTabData,
        [newTabId]: {
          selectedOption: 0,
          textareaValues: {},
          weights: { OCR: 50, ASR: 50, OD: 50 },
          selectedObject: '',
          results: [],
          reset: false,
        },
      }));
    
      setValue(newTabId); 
    };
    
  
    // Delete a tab
    const deleteTab = (e, tabId) => {
      e.stopPropagation();
      if (tabList.length === 1) return;
  
      let filteredTabs = tabList.filter((tab) => tab.id !== tabId);
      let newValue = value;
  
      if (value === tabId) {
        const tabIdIndex = tabList.findIndex((tab) => tab.id === tabId);
        newValue = tabIdIndex === 0 ? tabList[tabIdIndex + 1]?.id : tabList[tabIdIndex - 1]?.id;
      }
  
      setTabList(filteredTabs);
      setValue(newValue);
      setTabData((prevData) => {
        const newData = { ...prevData };
        delete newData[tabId];
        return newData;
      });
    };
  
    // Change active tab
    const handleTabChange = (newValue) => {
      setValue(newValue);
      console.log(newValue)
    };
    const saveTabData = (tabId, updateFn) => {
      setTabData((prevData) => ({
        ...prevData,
        [tabId]: updateFn(prevData[tabId]),
      }));
    };
    const handleSearch = (tabId, result) => {
      setSingleRes(result);
    };
  
    const handleConfirmStageSearch = (results) => {
      // Gửi data về BE
      console.log(`CONFIRMED`, results)
      setStageResults(results);
      setStageConfirm(true);
    };
    useEffect(() => {

    if (stageConfirm) {
      setShowStageSearch(false);
    }
  }, [stageResults, stageConfirm]);

    
  return (
    <div>
      <Navbar >
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav variant="tabs" >
            {tabList.map((tab) => (
              <Nav.Item key={tab.key}>
                <Nav.Link
                  style={{display:"flex"}}
                  active={tab.id === value}
                  onClick={() => handleTabChange(tab.id)}
                >
                  {"Stage " + tab.id}
                  <span onClick={(e) => deleteTab(e, tab.id)} class="material-symbols-outlined" style={{color:"red",fontWeight:"bolder"}}>close</span>
                </Nav.Link>
              </Nav.Item>
            ))}
            <div style={{display:"flex", alignItems:"center"}}>
              <span class="material-symbols-outlined" style={{color:"green", fontWeight:"bolder", cursor:"pointer"}} onClick={addTab}>add</span>
            </div>
            {stageConfirm && tabList.length > 1 && (
              <Nav.Item>
                <Nav.Link active={value === -1} onClick={() => setValue(-1)}>
                  Results
                </Nav.Link>
              </Nav.Item>
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      {tabList.map(
        (tab) =>
          tab.id === value && (
            <Row key={tab.id} style={{ margin: 10 }}>
              <Col md={4} className="border">
              <ErrorBoundary>
                <SearchOption
                  state={tabData[tab.id]}
                  setState={(newState) => saveTabData(tab.id, newState)}
                  onSearch={(result) => handleSearch(tab.id, result)}
                />
                </ErrorBoundary>
              </Col>
              <Col md={8} className="border">
                {singleRes.length > 0  && (
                  <RetrievalRes images = {singleRes}/>
                )}
              </Col>
            </Row>
          )
      )}
      {value === -1 && tabList.length > 1 && (
        <Row style={{ margin: 10 }}>
          <Col>
            {stageResults.length > 0  && (
              <StageSearchRes images={stageResults} />
              // <div>HELLO</div>
            )}
          </Col>
        </Row>
      )}
      {showStageSearch && (
        <StageSearch
        results={tabData}
        onConfirm={handleConfirmStageSearch}
        show={showStageSearch}
        onDeleteResult={deleteTab} 
      />
      )}
      
    </div>    
  );
}

export default TextImg;
