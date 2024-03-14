import Button from "@mui/material/Button";
import { useContext, useEffect, useState } from "react";
import { query, collection, getDocs, where, doc, orderBy } from "firebase/firestore";
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
  TextField
} from "@mui/material";
import CouponModal from "../components/CouponModal";
import '../App.css';

const Coupons: React.FC = () => {
  const { user } = useContext(AuthContext);
  const [coupons, setCoupons] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState( "start");

  const editCoupon = (coupon) => {
    console.log("editing", coupon);
    setSelectedCoupon({ ...coupon});
    setOpen(true);
  };

  const fetchCoupons = async () => {
    let q = query(
      collection(db, "Coupons"),
      where("userId", "==", doc(db, "Organizations/" + user.uid)),
        orderBy(sortBy)
    );

    if (searchQuery) {
      q = query(
          collection(db, "Coupons"),
          where("userId", "==", doc(db, "Organizations/" + user.uid)),
          where("name", ">=", searchQuery),
          where("name", "<=", searchQuery + "\uf8ff")
      );
    }

    const querySnapshot = await getDocs(q);
    const coupons = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      data.uid = doc.id;
      return data;
    });
    console.log(coupons);
    setCoupons(coupons);
  };

  const dialogClosed = () => {
    setOpen(false);
    setSelectedCoupon(null);
    fetchCoupons();
  };

  useEffect(() => {
    fetchCoupons();
  }, [searchQuery, sortBy]);

  return (
    <Box sx={{ m: 3 }}>
      <h1>Coupons</h1>

      <TextField
          label="Search by Name"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ marginBottom: 2 }}
      />
      <br/>
      <Button
          variant="contained"
          color="primary"
          onClick={() => {
            setSelectedCoupon(null);
            setOpen(true);
          }}
          sx={{ marginBottom: 2 }}
      >
        Add Coupon
      </Button>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell className={"coupon-header"} onClick={() => setSortBy("name")}>
                Name
                {sortBy === "name" && (
                    <span >▲</span>
                )}
              </TableCell>
              <TableCell className={"coupon-header"} onClick={() => setSortBy("description")}>
                Description
                {sortBy === "description" && (
                    <span >▲</span>
                )}
              </TableCell>
              <TableCell className={"coupon-header"} onClick={() => setSortBy("promocode")}>
                Promo Code
                {sortBy === "promocode" && (
                    <span >▲</span>
                )}
              </TableCell>
              <TableCell className={"coupon-header"} onClick={() => setSortBy("start")}>
                Start Date
                {sortBy === "start" && (
                    <span >▲</span>
                )}
              </TableCell>
              <TableCell className={"coupon-header"} onClick={() => setSortBy("end")}>
                End Date
                {sortBy === "end" && (
                    <span >▲</span>
                )}
              </TableCell>
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
                <TableCell>{row.promocode}</TableCell>
                <TableCell>{new Date(row.start.seconds * 1000).toISOString()}</TableCell>
                <TableCell>{new Date(row.end.seconds * 1000).toISOString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <CouponModal open={open} onClose={() => dialogClosed()} selectedCoupon={selectedCoupon} />

    </Box>
  );
};

export default Coupons;
