import { useContext } from "react";
import { AuthContext } from "./AuthProvider";
import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const { loading, user } = useContext(AuthContext);

  if (user) {
    return children;
  }

  return <Navigate to="/login" />;
};



PrivateRoute.propTypes = {
  children: PropTypes.node,
};

export default PrivateRoute;