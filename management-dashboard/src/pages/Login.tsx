import React, { useContext } from "react";
import { Box, Button, Link, TextField } from "@mui/material";
import { AuthContext } from "../AuthProvider";
import { useNavigate } from "react-router-dom";

const Login: React.FC  = () => {
  const navigate = useNavigate();
  const { loginUser, loading, user } = useContext(AuthContext);

  // If the user is already authenticated, redirect to the home page
  if (user) {
    navigate("/");
  }

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    console.log(email, password);
    loginUser(email, password).then(() => {
      navigate("/");
    }).catch((error) => {
      console.error('Error logging in user', error);
    });
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>

      <div>
        <div>
        <h1>Closetify - Login</h1>
        </div>
        <form onSubmit={handleFormSubmit}>
          <div>
            <TextField
              id="email"
              label="Email"
              variant="standard"
              sx={{ m: 1, width: "50ch" }}
            />
          </div>
          <div>
            <TextField
              id="password"
              label="Password"
              variant="standard"
              type="password"
              sx={{ m: 1, width: "50ch" }}
            />
          </div>
          <div>
            <Button type="submit" disabled={loading} variant="contained">
              Login
            </Button>
          </div>
        </form>
        <div style={{ marginTop: "20px" }}>
        <Link href="/register">Don't have an account - Register here</Link>
        </div>
      </div>
    </Box>
  );
};

export default Login;
