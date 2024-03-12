import Button from "@mui/material/Button";

import React from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

const Map: React.FC = () => {
  let showAddCoupon = false;

  const initialCoupons = [
    {
        id: 1,
        name: 'SHALMART',
        description: '20% off on beans!',
        startDate: '2022-01-01',
        endDate: '2022-12-31',
    },
    {
        id: 2,
        name: 'SHALMART',
        description: 'Buy one get one 50% off!',
        startDate: '2022-01-01',
        endDate: '2022-12-31',
    },
];

  return (
    <Box sx={{ m: 3 }}>
      <h1>Coupons</h1>

      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          showAddCoupon = true;
        }}
        sx={{marginBottom: 2}}
      >
        Add Coupon
      </Button>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Id</TableCell>
              <TableCell align="right">Name</TableCell>
              <TableCell align="right">Description</TableCell>
              <TableCell align="right">Start Date</TableCell>
              <TableCell align="right">End Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {initialCoupons.map((row) => (
              <TableRow
                key={row.name}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.id}
                </TableCell>
                <TableCell align="right">{row.name}</TableCell>
                <TableCell align="right">{row.description}</TableCell>
                <TableCell align="right">{row.startDate}</TableCell>
                <TableCell align="right">{row.endDate}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Map;
