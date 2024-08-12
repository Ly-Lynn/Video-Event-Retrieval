import React, { useEffect } from "react";
import { Tabs, Tab, Box } from "@mui/material";

const CusTabs = ({ tabs, currentTab, onTabClick }) => {
  const handleChange = (event, newValue) => {
    onTabClick(newValue);
    localStorage.setItem('currentTab', newValue); // Save the current tab index
  };

  useEffect(() => {
    const savedTab = localStorage.getItem('currentTab');
    if (savedTab !== null) {
      onTabClick(parseInt(savedTab, 10)); // Load the saved tab index
    }
  }, [onTabClick]);

  return (
    <Box>
      <Tabs
        value={currentTab}
        onChange={handleChange}
        textColor="primary"
        indicatorColor="primary"
        aria-label="tabs example"
      >
        {tabs.map((tab, index) => (
          <Tab key={index} value={index} label={tab.title} />
        ))}
      </Tabs>
    </Box>
  );
};

export default CusTabs;
