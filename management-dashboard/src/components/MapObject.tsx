import { Button, TextField } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { Stage, Layer, Rect, Circle, Text } from "react-konva";
import { AuthContext } from "../AuthProvider";
import BeaconModal from "./BeaconModal";
import BeaconService from "../services/BeaconService";
import CouponService from "../services/CouponService";
import MapService from "../services/MapService";

export const MapObject = () => {
  const { user } = useContext(AuthContext);
  const [beacons, setBeacons] = useState<any>([]);
  const [coupons, setCoupons] = useState<any>([]);
  const [stageWidth, setStageWidth] = useState<number>(window.innerWidth - 200);
  const [stageHeight, setStageHeight] = useState<number>(window.innerHeight);
  const [open, setOpen] = useState(false);
  const [width, setWidth] = useState<number>(13);
  const [map, setMap] = useState<any>([]);
  const [height, setHeight] = useState<number>(13);
  const [selectedBeacon, setSelectedBeacon] = useState(null);

  const fetchBeacons = async () => {
    const beaconObjs = await BeaconService.fetchBeacons();
    setBeacons(
      beaconObjs.map((beacon) => {
        return {
          x: (beacon.x / width) * stageWidth,
          y: (beacon.y / height) * stageHeight,
          isDragging: false,
          userId: beacon.userId,
          name: beacon.name,
          uuid: beacon.uuid,
          id: beacon.id,
        };
      })
    );
  };

  const fetchCoupons = async () => {
    const couponObjs = await CouponService.fetchCoupons();
    setCoupons(
      couponObjs.map((coupons) => {
        return {
          x: (coupons.x / width) * stageWidth,
          y: (coupons.y / height) * stageHeight,
          isDragging: false,
          userId: coupons.userId,
          id: coupons.id,
          // TODO add additonal coupon fieldss
        };
      })
    );
  };

  const fetchMap = async () => {
    const map = await MapService.fetchMap();

    if (map.length > 0) {
      setWidth(map[0].width);
      setHeight(map[0].height);
    } else {
      MapService.addMap({ width: 13, height: 13 });
    }

    setMap(map[0]);
  };

  useEffect(() => {
    fetchMap();
    fetchBeacons();
    fetchCoupons();
  }, []);

  const handleAddBeacon = () => {
    setOpen(true);
  };

  const handleDragStart = (id: string) => {
    setBeacons((prevBeacons) =>
      prevBeacons.map((beacon) =>
        beacon.id === id ? { ...beacon, isDragging: true } : beacon
      )
    );
  };

  const handleDragEnd = (beacon: any, x: number, y: number) => {
    console.log(beacon);
    setBeacons((prevBeacons) =>
      prevBeacons.map((prevBeacon) =>
        prevBeacon.id === beacon.id
          ? { ...prevBeacon, isDragging: false, x, y }
          : prevBeacon
      )
    );

    beacons.find((b) => b.id === beacon.id).x = getScaledX(x);
    beacons.find((b) => b.id === beacon.id).y = getScaledY(y);

    BeaconService.updateBeacon({
      id: beacon.id,
      name: beacon.name,
      userId: beacon.userId,
      uuid: beacon.uuid,
      x: getScaledX(x),
      y: getScaledY(y),
    });
  };

  // const heightChange = (e) => {
  //   setHeight(Number(e.target.value));
  //   setStageHeight(stageWidth * (height / width));

  //   MapService.updateMap({ width, height }, map.id);
  // };

  // const widthChange = (e) => {
  //   setWidth(Number(e.target.value));

  //   MapService.updateMap({ width, height }, map.id);
  // };

  const getScaledX = (x: number) => {
    return Math.round((x / stageWidth) * width * 2) / 2;
  };

  const getScaledY = (y: number) => {
    return Math.round((y / stageHeight) * height * 2) / 2;
  };

  const dialogClosed = () => {
    setOpen(false);
    setSelectedBeacon(null);
    fetchBeacons();
  };

  const editBeacon = (beacon) => {
    beacon.x = getScaledX(beacon.x);
    beacon.y = getScaledY(beacon.y);
    setSelectedBeacon(beacon);
    setOpen(true);
  };

  const saveMap = () => {
    MapService.updateMap({ width, height }, map.id);
    setStageHeight(stageWidth * (height / width));
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
        onChange={(e) => setHeight(Number(e.target.value))}
        sx={{ m: 1 }}
      />

      <Button
        sx={{ m: 1 }}
        variant="contained"
        color="primary"
        onClick={saveMap}
      >
        Save
      </Button>

      <Stage
        width={stageWidth + 10}
        height={stageHeight + 10}
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
                  handleDragEnd(beacon, e.target.x(), e.target.y())
                }
                onDblClick={() => editBeacon(beacon)}
              />
              <Text
                x={beacon.x + 15}
                y={beacon.y - 5}
                text={`(${getScaledX(beacon.x)}, ${getScaledY(beacon.y)})`}
                fontSize={12}
              />
            </React.Fragment>
          ))}

          {coupons.map((coupon) => (
            <React.Fragment key={coupon.id}>
              <Rect
                x={coupon.x}
                y={coupon.y}
                stroke="black"
                width={10}
                height={10}
                // onDblClick={() => editBeacon(coupon)}
              />
              <Text
                x={coupon.x + 15}
                y={coupon.y - 5}
                text={`(${getScaledX(coupon.x)}, ${getScaledY(coupon.y)})`}
                fontSize={12}
              />
            </React.Fragment>
          ))}
        </Layer>
      </Stage>

      <BeaconModal
        open={open}
        onClose={() => dialogClosed()}
        selectedBeacon={selectedBeacon}
      />
    </div>
  );
};

export default MapObject;
