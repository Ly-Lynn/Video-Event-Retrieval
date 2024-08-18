// src/components/Summary.js
import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const ODRes = ({ results }) => {
  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell variant='head' style={{fontWeight:"bolder"}}>Object</TableCell>
            <TableCell variant='head' style={{fontWeight:"bolder"}}>Coordinates</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {results.map((result, index) => (
            <TableRow key={index}>
              <TableCell>{result.object}</TableCell>
              <TableCell>{result.coordinates[0]} {result.coordinates[1]} {result.coordinates[2]} {result.coordinates[3]}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ODRes;
