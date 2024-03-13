import Button from "@mui/material/Button";
import { useContext, useEffect, useState } from "react";
import { query, collection, getDocs, where, doc } from "firebase/firestore";
import { db } from "../FirebaseConfig";
import { AuthContext } from "../AuthProvider";
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

const Coupons: React.FC = () => {
  let showAddCoupon = false;
  const { user } = useContext(AuthContext);
  const [coupons, setCoupons] = useState([]);

  const editCoupon = (coupon) => {
    console.log("editing", coupon);
  };

  const fetchCoupons = async () => {
    const q = query(
      collection(db, "Coupons"),
      where("userId", "==", doc(db, "Organizations/" + user.uid))
    );
    const querySnapshot = await getDocs(q);
    const coupons = querySnapshot.docs.map((doc) => doc.data());
    console.log(coupons);
    setCoupons(coupons);
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  return (
    <Box sx={{ m: 3 }}>
      <h1>Coupons</h1>

      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          showAddCoupon = true;
        }}
        sx={{ marginBottom: 2 }}
      >
        Add Coupon
      </Button>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>End Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {coupons.map((row) => (
              <TableRow
                key={row.uid}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  "&:hover": {
                    backgroundColor: "lightgray",
                    cursor: "pointer",
                  },
                }}
                onClick={() => {
                  editCoupon(row);
                }}
              >
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.description}</TableCell>
                <TableCell>{new Date(row.start.seconds * 1000).toISOString()}</TableCell>
                <TableCell>{new Date(row.end.seconds * 1000).toISOString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Coupons;
