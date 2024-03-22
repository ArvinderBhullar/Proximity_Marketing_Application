import React, { useContext, useState, useEffect } from "react";
import { Box, Dialog, Typography, TextField, Button } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { db } from "../FirebaseConfig";
import { collection, addDoc, doc, updateDoc, deleteDoc, Timestamp} from "firebase/firestore";
import { AuthContext } from "../AuthProvider";
import { DocumentReference } from 'firebase/firestore';
import dayjs from "dayjs";

interface CouponModalProps {
  open: boolean;
  onClose: () => void;
  selectedCoupon?: any;
}

interface CouponData {
  name: string;
  description: string;
  promocode: string;
  start: Timestamp;
  end: Timestamp;
  userId: DocumentReference;
  x: number;
  y: number;
}

const CouponModal: React.FC<CouponModalProps> = ({ open, onClose, selectedCoupon }) => {
  const { user } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [promocode, setPromocode] = useState("");
  const [start, setStart] = useState(Timestamp.now().toDate());
  const [end, setEnd] = useState(Timestamp.now().toDate());
  const [userId, setUserId] = useState(doc(db, "Organizations/" + user.uid));
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [confirmationOpen, setConfirmationOpen] = useState(false);

  useEffect(() => {
    if (selectedCoupon) {
      setName(selectedCoupon.name);
      setDescription(selectedCoupon.description);
      setPromocode(selectedCoupon.promocode);
      setStart(selectedCoupon.start.toDate());
      setEnd(selectedCoupon.end.toDate());
      setX(selectedCoupon.x);
      setY(selectedCoupon.y);
    } else {
      setName("");
      setDescription("");
      setPromocode("");
      setStart(Timestamp.now().toDate());
      setEnd(Timestamp.now().toDate());
      setX(0);
      setY(0);
    }

  }, [open, onClose, selectedCoupon]);


  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;

    const couponData: CouponData = {
      name: form.elements["name"].value,
      description: form.elements["description"].value,
      promocode: form.elements["promocode"].value,
      x: parseFloat(form.elements["x"].value),
      y: parseFloat(form.elements["y"].value),
      start: Timestamp.fromDate(new Date(form.elements["start"].value)),
      end: Timestamp.fromDate(new Date(form.elements["end"].value)),
      userId: doc(db, "Organizations/" + user.uid) // Assign userId with a valid DocumentReference
    };

    const couponDataPlainObject = { ...couponData }; // Convert to plain JavaScript object

    if (selectedCoupon) {
      try {
        const couponRef = doc(db, "Coupons", selectedCoupon.uid);
        await updateDoc(couponRef, couponDataPlainObject); // Pass plain object to Firestore function
        console.log("Coupon updated successfully!");
      } catch (error) {
        console.error("Error updating coupon:", error);
      }
    } else {
      try {
        await addDoc(collection(db, "Coupons"), couponDataPlainObject); // Pass plain object to Firestore function
        console.log("Coupon created successfully!");
      } catch (error) {
        console.error("Error creating coupon:", error);
      }
    }
    onClose();
  };

  const handleDelete = async () => {
    setConfirmationOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedCoupon) {
      try {
        const couponRef = doc(db, "Coupons", selectedCoupon.uid);
        await deleteDoc(couponRef); // Delete the selected coupon
        console.log("Coupon deleted successfully!");
        onClose();
      } catch (error) {
        console.error("Error deleting coupon:", error);
      }
    }
    setConfirmationOpen(false);
  };

  const cancelDelete = () => {
    setConfirmationOpen(false);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <Box sx={{ m: 2 }}>
        <Typography variant="h6" gutterBottom>
          {selectedCoupon ? "Edit Coupon" : "Add Coupon"}
        </Typography>
        <form onSubmit={handleSubmit}>
          <div>
            <TextField id='name'
                       label="Name"
                       value={name}
                       onChange={e => setName(e.target.value)}
                       sx={{ m: 1, width: "50ch" }} />
          </div>
          <div>
            <TextField
              id='description'
              multiline
              label="Description"
              value={description}
              onChange={e => setDescription(e.target.value)}
              sx={{ m: 1, width: "50ch" }}
            />
          </div>
          <div>
            <TextField id='promocode'
                       label="Promo Code"
                       value={promocode}
                       onChange={e => setPromocode(e.target.value)}
                       sx={{ m: 1, width: "50ch" }} />
          </div>
          <div>
            <LocalizationProvider  dateAdapter={AdapterDayjs}>
              <DatePicker sx={{ m: 1 }}
                          label="Start"
                          name='start'
                          value={dayjs(start)}
                          />
            </LocalizationProvider>
          </div>
          <div>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker sx={{ m: 1 }}
                          label="end"
                          name='end'
                          value={dayjs(end)}
                          />
            </LocalizationProvider>
          </div>

          <div>
            <TextField
              id='x'
              label="X"
              type="number"
              value={x}
              onChange={e => setX(parseFloat(e.target.value))}
              sx={{ m: 1, width: "25ch" }}
            />
          <TextField id='y'
                       label="y"
                       type="number"
                       value={y}
                       onChange={e => setY(parseFloat(e.target.value))}
                       sx={{ m: 1, width: "25ch" }} />
          </div>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ m: 1 }}
          >
            {selectedCoupon ? "Update" : "Save"}
          </Button>
          <Button variant="contained" onClick={onClose} sx={{ m: 1 }}>
            Cancel
          </Button>
          {selectedCoupon && (
              <div>
                <Button variant="contained" onClick={handleDelete} sx={{ m: 1 }}>
                  Delete
                </Button>
                <Dialog open={confirmationOpen} onClose={cancelDelete}>
                  <Box sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      Confirm Delete
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      Are you sure you want to delete this coupon?
                    </Typography>
                    <Button variant="contained" onClick={confirmDelete} sx={{ m: 1 }}>
                      Yes
                    </Button>
                    <Button variant="contained" onClick={cancelDelete} sx={{ m: 1 }}>
                      No
                    </Button>
                  </Box>
                </Dialog>
              </div>
          )}
        </form>
      </Box>
    </Dialog>
  );
};

export default CouponModal;
