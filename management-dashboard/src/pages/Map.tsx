import React from "react";
import { Box } from "@mui/material";
import MapObject from "../components/MapObject";


/**
 * Renders the Map page component.
 * Contributes to FR-5
 * @returns The rendered Map page component.
 */
const Map: React.FC = () => {
  return (
    <Box sx={{ m: 3 }}>
      <h1>Map Page</h1>

      <MapObject />
    </Box>
  );
};

export default Map;
