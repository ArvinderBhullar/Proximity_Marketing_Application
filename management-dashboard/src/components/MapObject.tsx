import { Button, TextField } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { Stage, Layer, Rect, Circle, Text } from "react-konva";
import { AuthContext } from "../AuthProvider";
import BeaconModal from "./BeaconModal";
import BeaconService from "../services/BeaconService";
import CouponService from "../services/CouponService";
import MapService from "../services/MapService";
import { KonvaEventObject } from "konva/lib/Node";

/**
 * Represents the MapObject component.
 * This component displays a map with beacons and coupons.
 */
export const MapObject = () => {
  const { user } = useContext(AuthContext);
  const [beacons, setBeacons] = useState<any>([]);
  const [coupons, setCoupons] = useState<any>([]);
  const [stageWidth, setStageWidth] = useState<number>(window.innerWidth - 200);
  const [stageHeight, setStageHeight] = useState<number>(window.innerHeight);
  const [open, setOpen] = useState(false);
  const [width, setWidth] = useState<number>(14);
  const [inputWidth, setInputWidth] = useState<number>(14);
  const [inputHeight, setInputHeight] = useState<number>(7);
  const [map, setMap] = useState<any>([]);
  const [height, setHeight] = useState<number>(7);
  const [selectedBeacon, setSelectedBeacon] = useState(null);
  const [hoverdId, setHoverId] = useState(null);

  /**
   * Fetches the list of beacons from the server.
   */
  const fetchBeacons = async () => {
    const beaconObjs = await BeaconService.fetchBeacons();
    console.log('beacons fetched', beaconObjs)
    setBeacons(
      beaconObjs.map((beacon) => {
        return {
          x: beacon.x === 0 ? 5 :(beacon.x / width) * stageWidth,
          y: beacon.y === 0 ? 5 :(beacon.y / height) * stageHeight,
          isDragging: false,
          userId: beacon.userId,
          name: beacon.name,
          uuid: beacon.uuid,
          id: beacon.id,
        };
      })
    );
  };

  /**
   * Fetches the list of coupons from the server.
   */
  const fetchCoupons = async () => {
    const couponObjs = await CouponService.fetchCoupons();
    setCoupons(
      couponObjs.map((coupons) => {
        return {
          x: coupons.x === 0 ? 5 : (coupons.x / width) * stageWidth,
          y: coupons.y === 0 ? 5 : (coupons.y / height) * stageHeight,
          isDragging: false,
          userId: coupons.userId,
          id: coupons.id,
          name: coupons.name,
          // TODO add additional coupon fields
        };
      })
    );
  };

  /**
   * Fetches the map from the server.
   */
  const fetchMap = async () => {
    console.log('fetching map')
    const map = await MapService.fetchMap();

    if (map.length > 0) {
      setWidth(map[0].width);
      setHeight(map[0].height * 1.0);
      setInputWidth(map[0].width);
      setInputHeight(map[0].height);  
    } else {
      MapService.addMap({ width: 13, height: 13 });
    }

    let sh = stageWidth * (map[0].height / map[0].width)
    await setStageHeight(sh);
  };

  useEffect(() => {
    init();
  }, [stageHeight]);

  /**
   * Initializes the component by fetching the map, beacons, and coupons.
   */
  const init = async () => {
    fetchMap().then(() => { 
      console.log('map fetched')
      console.log(width, height, stageWidth, stageHeight)
      fetchBeacons();
      fetchCoupons();
    });
  }

  /**
   * Handles the event when the "Add Beacon" button is clicked.
   */
  const handleAddBeacon = () => {
    setOpen(true);
  };

  /**
   * Handles the event when a beacon is being dragged.
   * @param id - The ID of the beacon being dragged.
   */
  const handleDragStart = (id: string) => {
    setBeacons((prevBeacons) =>
      prevBeacons.map((beacon) =>
        beacon.id === id ? { ...beacon, isDragging: true } : beacon
      )
    );
  };

  /**
   * Handles the event when a beacon is dropped after being dragged.
   * @param beacon - The beacon object being dragged.
   * @param x - The new X coordinate of the beacon.
   * @param y - The new Y coordinate of the beacon.
   */
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

  /**
   * Scales the X coordinate of a point based on the stage width and map width.
   * @param x - The X coordinate to scale.
   * @returns The scaled X coordinate.
   */
  const getScaledX = (x: number) => {
    return Math.round((x / stageWidth) * width * 2) / 2;
  };

  /**
   * Scales the Y coordinate of a point based on the stage height and map height.
   * @param y - The Y coordinate to scale.
   * @returns The scaled Y coordinate.
   */
  const getScaledY = (y: number) => {
    return Math.round((y / stageHeight) * height * 2) / 2;
  };

  /**
   * Handles the event when the dialog is closed.
   */
  const dialogClosed = () => {
    setOpen(false);
    setSelectedBeacon(null);
    fetchBeacons();
  };

  /**
   * Handles the event when a beacon is being edited.
   * @param beacon - The beacon object being edited.
   */
  const editBeacon = (beacon) => {
    beacon.x = getScaledX(beacon.x);
    beacon.y = getScaledY(beacon.y);
    setSelectedBeacon(beacon);
    setOpen(true);
  };

  /**
   * Saves the map with the updated width and height.
   */
  const saveMap = async () => {
    setBeacons([]);
    setCoupons([]);
    setHeight(inputHeight);
    setWidth(inputWidth);
    await MapService.updateMap({ 'height' : inputHeight, "width": inputWidth }, map.id);
    init();
  };

  /**
   * Ensures that a beacon stays within the boundaries of the stage.
   * @param e - The event object.
   * @param beacon - The beacon object.
   */
  const boundaries = (e, beacon: any) => {
    if (e.target.x() > stageWidth) {
      e.target.x(stageWidth);
    } else if (e.target.x() < 0) {
      e.target.x(5);
    }

    if (e.target.y() > stageHeight) {
      e.target.y(stageHeight);
    } else if (e.target.y() < 0) {
      e.target.y(5);
    }
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
        value={inputWidth}
        onChange={(e) => setInputWidth(Number(e.target.value))}
        sx={{ m: 1 }}
      />

      <TextField
        label="Height"
        type="number"
        value={inputHeight}
        onChange={(e) => setInputHeight(Number(e.target.value))}
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
        width={stageWidth + 100}
        height={stageHeight +10}
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
                onDragMove={(e) => {boundaries(e, beacon)}}
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
                onMouseOver={() => setHoverId(coupon.id)}
                onMouseLeave={() => setHoverId(null)}
                // onDblClick={() => editBeacon(coupon)}
              />
              <Text
                x={coupon.x + 15}
                y={coupon.y - 5}
                text={`(${getScaledX(coupon.x)}, ${getScaledY(coupon.y)})`}
                fontSize={12}
              />
            
            {coupon.id === hoverdId && (
                <Text
                  x={coupon.x - 5}
                  y={coupon.y + 15}
                  text={`${coupon.name}`}
                  fontSize={12}
                />
                )}
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
