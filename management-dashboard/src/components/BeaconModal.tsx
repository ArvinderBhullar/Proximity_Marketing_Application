import React, { useContext, useState, useEffect } from "react";
import { Box, Dialog, Typography, TextField, Button } from "@mui/material";
import { db } from "../FirebaseConfig";
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { AuthContext } from "../AuthProvider";
import { DocumentReference } from "firebase/firestore";
import BeaconService from "../services/BeaconService";

interface BeaconModalProps {
  open: boolean;
  onClose: () => void;
  selectedBeacon?: any;
}

interface BeaconData {
  name: string;
  uuid: string;
  x: number;
  y: number;
  userId: DocumentReference;
}

const BeaconModal: React.FC<BeaconModalProps> = ({
  open,
  onClose,
  selectedBeacon,
}) => {
  const { user } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [uuid, setUuid] = useState("");
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [confirmationOpen, setConfirmationOpen] = useState(false);

  useEffect(() => {
    if (selectedBeacon) {
      setName(selectedBeacon.name);
      setUuid(selectedBeacon.uuid);
      setX(selectedBeacon.x);
      setY(selectedBeacon.y);
    }
  }, [open, onClose, selectedBeacon]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;

    const beaconData: BeaconData = {
      name: form.elements["name"].value,
      uuid: form.elements["uuid"].value,
      x: parseFloat(form.elements["x"].value),
      y: parseFloat(form.elements["y"].value),
      userId: doc(db, "Organizations/" + user.uid),
    };

    if (selectedBeacon) {
      BeaconService.updateBeacon({ ...beaconData, id: selectedBeacon.id });
    } else {
      BeaconService.addBeacon(beaconData);
    }
    onClose();
  };

  const handleDelete = async () => {
    setConfirmationOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedBeacon) {
      BeaconService.deleteBeacon(selectedBeacon.id);
    }
    setConfirmationOpen(false);
    onClose();
  };

  const cancelDelete = () => {
    setConfirmationOpen(false);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <Box sx={{ m: 2 }}>
        <Typography variant="h6" gutterBottom>
          {selectedBeacon ? "Edit Beacon" : "Add Beacon"}
        </Typography>
        <form onSubmit={handleSubmit}>
          <div>
            <TextField
              id="name"
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              sx={{ m: 1, width: "50ch" }}
            />
          </div>
          <div>
            <TextField
              id="uuid"
              multiline
              label="UUID"
              value={uuid}
              onChange={(e) => setUuid(e.target.value)}
              sx={{ m: 1, width: "50ch" }}
            />
          </div>
          <div>
            <TextField
              id="x"
              label="X"
              type="number"
              value={x}
              onChange={(e) => setX(parseFloat(e.target.value))}
              sx={{ m: 1, width: "50ch" }}
            />
          </div>
          <div>
            <TextField
              id="y"
              label="y"
              type="number"
              value={y}
              onChange={(e) => setY(parseFloat(e.target.value))}
              sx={{ m: 1, width: "50ch" }}
            />
          </div>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ m: 1 }}
          >
            {selectedBeacon ? "Update" : "Save"}
          </Button>
          <Button variant="contained" onClick={onClose} sx={{ m: 1 }}>
            Cancel
          </Button>
          {selectedBeacon && (
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
                    Are you sure you want to delete this beacon?
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={confirmDelete}
                    sx={{ m: 1 }}
                  >
                    Yes
                  </Button>
                  <Button
                    variant="contained"
                    onClick={cancelDelete}
                    sx={{ m: 1 }}
                  >
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

export default BeaconModal;
