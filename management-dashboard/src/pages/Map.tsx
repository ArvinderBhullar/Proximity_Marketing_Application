import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
import React from "react";
import { Box } from "@mui/material";
import MapObject from "../components/MapObject";

// https://mui.com/material-ui/react-button/#file-upload
const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const Map: React.FC = () => {
  let file = undefined;

  const onFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.files);
    file = e.target.files;
  };

  return (
    <Box sx={{ m: 3 }}>
      <h1>Welcome to the Map Page</h1>

      <MapObject />

      <Button
        component="label"
        role={undefined}
        variant="contained"
        tabIndex={-1}
        startIcon={<CloudUploadIcon />}
      >
        Upload file
        <VisuallyHiddenInput type="file" 
          onChange={onFileUpload} 
          accept="image/*" 
        />
      </Button>

      {file && (
        <div>
          <h2>Selected File:</h2>
          <p>{file.name}</p>
        </div>
      )}
    </Box>
  );
};

export default Map;
