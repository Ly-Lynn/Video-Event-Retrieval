import React from "react";
import { Tabs, Tab, Box } from "@mui/material";

const CusTabs = ({ tabs, currentTab, onTabClick }) => {
  const handleChange = (event, newValue) => {
    onTabClick(newValue);
  };

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