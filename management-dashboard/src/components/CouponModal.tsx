import React, { useContext } from "react";
import { Box, Dialog, Typography, TextField, Button } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { db } from "../FirebaseConfig";
import { collection, addDoc, doc } from "firebase/firestore";
import { AuthContext } from "../AuthProvider";

interface CouponModalProps {
  open: boolean;
  onClose: () => void;
}

const CouponModal: React.FC<CouponModalProps> = ({ open, onClose }) => {
  const { user } = useContext(AuthContext);

  const createCoupon = async (couponData: any) => {
    couponData.userId = doc(db, "Organizations/" + user.uid); // Access the 'doc' method correctly
    try {
      await addDoc(collection(db, "Coupons"), couponData);
      console.log("Coupon created successfully!");
    } catch (error) {
      console.error("Error creating coupon:", error);
    } finally {
      onClose();
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;

    console.log("Form submitted", form.elements);

    const name = form.elements["name"].value;
    const description = form.elements["description"].value;
    const promoCode = form.elements["promocode"].value;
    const start = form.elements["start"].value;
    const end = form.elements["end"].value;

    const couponData = {
      name,
      description,
      promoCode,
      start,
      end,
    };

    createCoupon(couponData);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <Box sx={{ m: 2 }}>
        <Typography variant="h6" gutterBottom>
          Add Coupon
        </Typography>
        <form onSubmit={handleSubmit}>
          <div>
            <TextField id='name' label="Name" sx={{ m: 1, width: "50ch" }} />
          </div>
          <div>
            <TextField
              id='description'
              multiline
              label="Description"
              sx={{ m: 1, width: "50ch" }}
            />
          </div>
          <div>
            <TextField id='promocode' label="Promo Code" sx={{ m: 1, width: "50ch" }} />
          </div>
          <div>
            <LocalizationProvider  dateAdapter={AdapterDayjs}>
              <DatePicker sx={{ m: 1 }} label="Start" name='start' />
            </LocalizationProvider>
          </div>
          <div>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker sx={{ m: 1 }} label="end" name='end' />
            </LocalizationProvider>
          </div>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ m: 1 }}
          >
            Save
          </Button>
          <Button variant="contained" onClick={onClose} sx={{ m: 1 }}>
            Cancel
          </Button>
        </form>
      </Box>
    </Dialog>
  );
};

export default CouponModal;
