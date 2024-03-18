import { Box, Button, TextField } from "@mui/material";
import React, { useContext, useEffect } from "react";
import { Stage, Layer, Rect, Circle, Text } from "react-konva";
import {
  query,
  collection,
  getDocs,
  where,
  doc,
  orderBy,
} from "firebase/firestore";
import { db } from "../FirebaseConfig";
import { AuthContext } from "../AuthProvider";

export const MapObject = () => {
  const { user } = useContext(AuthContext);
  const [beacons, setBeacons] = React.useState<
    { x: number; y: number; id: string }[]
  >([]);
  const [stageWidth, setStageWidth] = React.useState<number>(
    window.innerWidth - 200
  );
  const [stageHeight, setStageHeight] = React.useState<number>(
    window.innerHeight
  );
  const [width, setWidth] = React.useState<number>(20);
  const [height, setHeight] = React.useState<number>(10);

  useEffect(() => {
    const fetchBeacons = async () => {
      const q = query(
        collection(db, "Beacons"),
        where("userId", "==", doc(db, "Organizations/" + user.uid))
      );
      const querySnapshot = await getDocs(q);
      const beacons = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          x: (data.x / width) * stageWidth,
          y: (data.y / height) * stageHeight,
          uuid: data.beaconUUID,
        }
      });
      console.log(beacons);
      setBeacons(beacons);
    };

    fetchBeacons();
  }, []);

  const handleAddBeacon = () => {
    const newBeacon = {
      x: 0,
      y: 0, 
      uuid: Math.random().toString(), 
      id: Math.random().toString(),
      isDragging: false,
    };

    setBeacons((prevBeacons) => [...prevBeacons, newBeacon]);
  };

  const handleDragStart = (id: string) => {
    setBeacons((prevBeacons) =>
      prevBeacons.map((beacon) =>
        beacon.id === id ? { ...beacon, isDragging: true } : beacon
      )
    );
  };

  const handleDragEnd = (id: string, x: number, y: number) => {
    setBeacons((prevBeacons) =>
      prevBeacons.map((beacon) =>
        beacon.id === id ? { ...beacon, isDragging: false, x, y } : beacon
      )
    );
  };

  const heightChange = (e) => {
    setHeight(Number(e.target.value));
    setStageHeight(stageWidth * (height / width));
  };

  const getScaledX = (x: number) => {
    return Math.round((x / stageWidth) * width * 2) / 2;
  };

  const getScaledY = (y: number) => {
    return Math.round((y / stageHeight) * height * 2) / 2;
  };

  return (
    <div>
      <Button
        sx={{ m: 1 }}
        variant="contained"
        color="primary"
        onClick={handleAddBeacon}
      >
        Add Beacon
      </Button>

      <TextField
        label="Width"
        type="number"
        value={width}
        onChange={(e) => setWidth(Number(e.target.value))}
        sx={{ m: 1 }} 
      />

      <TextField
        label="Height"
        type="number"
        value={height}
        onChange={(e) => heightChange(e)}
        sx={{ m: 1 }}
      />

      <Stage
        width={stageWidth}
        height={stageHeight}
        style={{ border: "1px solid black", width: stageWidth }}
      >
        <Layer>
          {beacons.map((beacon) => (
            <React.Fragment key={beacon.id}>
              <Circle
                x={beacon.x}
                y={beacon.y}
                stroke="black"
                radius={5}
                draggable
                onDragStart={() => handleDragStart(beacon.id)}
                onDragEnd={(e) =>
                  handleDragEnd(beacon.id, e.target.x(), e.target.y())
                }
              />
              <Text
                x={beacon.x + 15}
                y={beacon.y - 5}
                text={`(${getScaledX(beacon.x)}, ${getScaledY(beacon.y)})`}
                fontSize={12}
              />
            </React.Fragment>
          ))}
        </Layer>
      </Stage>
    </div>
  );
};

export default MapObject;
