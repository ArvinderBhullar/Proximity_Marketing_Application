import { useContext } from "react";
import { AuthContext } from "./AuthProvider";
import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const { loading, user } = useContext(AuthContext);

  if (loading) {
    console.log("Loading, returning null");
    return null;
  }
  
  if (user) {
    console.log("User is authenticated, rendering children", user);
    return children;
  } else {
    console.log("User is not authenticated, redirecting to login");
    return <Navigate to="/login" />;
  }

  
};



PrivateRoute.propTypes = {
  children: PropTypes.node,
};

export default PrivateRoute;