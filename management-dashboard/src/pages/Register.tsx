import React, { useContext } from "react";
import { Box, Button, Link, TextField } from "@mui/material";
import { AuthContext } from "../AuthProvider";
import { useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import { db} from "../FirebaseConfig";

/**
 * Register component for user registration.
 * Renders a form for users to register with their organization name, address, email, and password.
 * If the user is already authenticated, redirects to the home page.
 * Contributes to FR-1
 */
const Register: React.FC = () => {
  const navigate = useNavigate();
  const { createUser, loading, user } = useContext(AuthContext);

  // If the user is already authenticated, redirect to the home page
  if (user) {
    navigate("/");
  }

  /**
   * Handles the form submission when the user clicks the Register button.
   * Retrieves the form values and creates a new user with the provided email and password.
   * Saves the user's organization details to the database.
   * @param {any} e - The form submission event.
   */
  const handleFormSubmit = async (e: any) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    const organizationName = e.target.organizationName.value;
    const address = e.target.address.value;
    console.log(email, password);
    createUser(email, password)
      .then(async (result) => {
        await setDoc(doc(db, "Organizations", result.user.uid), {
          email: email,
          address: address,
          organizationName: organizationName,
        });
      })
      .catch((error) => {
        console.error("Error logging in user", error);
      });
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
      <div>
        <div>
          <h1>Closetify - Register</h1>
        </div>
        <form onSubmit={handleFormSubmit}>
          <div>
            <TextField
              id="organizationName"
              label="organization Name"
              variant="standard"
              sx={{ m: 1, width: "50ch" }}
            />
          </div>
          <div>
            <TextField
              id="address"
              label="address"
              variant="standard"
              sx={{ m: 1, width: "50ch" }}
            />
          </div>
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
              Register
            </Button>
          </div>
        </form>
        <div style={{ marginTop: "20px" }}>
          <Link href="/login">Already have an account - Login here</Link>
        </div>
      </div>
    </Box>
  );
};

export default Register;
