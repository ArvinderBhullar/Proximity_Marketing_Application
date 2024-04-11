import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import HomeIcon from "@mui/icons-material/Home";
import { useContext } from "react";
import { AuthContext } from "../AuthProvider";

/**
 * Renders the ButtonAppBar component.
 * @returns The rendered ButtonAppBar component.
 */
export default function ButtonAppBar() {
  const { user, logOut } = useContext(AuthContext);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          {user && (
            <IconButton
              href="/"
              size="large"
              edge="start"
              color="inherit"
              aria-label="home"
              sx={{ mr: 2 }}
            >
              <HomeIcon />
            </IconButton>
          )}

          <Box sx={{ dispaly: "flex", flexDirection: "row", flexGrow: 1 }}>
            <Typography variant="h6" component='span' sx={{justifyContent: 'center'}}>
              Management Dashboard
            </Typography>
            {user && (
              <span>
              <Button sx={{m: 1}} color="inherit" href="map">
                Map
              </Button>
              <Button sx={{m: 1}} color="inherit" href="coupons">
                Coupons
              </Button>
              <Button sx={{m: 1}} color="inherit" href="reports">
                Reports
              </Button>
              
              </span>
            )}
          </Box>

          {user && (
            <Button color="inherit" onClick={logOut}>
              Logout
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
