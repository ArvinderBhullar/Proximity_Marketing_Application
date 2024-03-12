// Routes.js
import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Register from './pages/Register';
import Home from './pages/Home';
import  Login  from './pages/Login';
import PrivateRoute from "./PrivateRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/home",
        element: (
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        ),
      },
    ],
  },
]);

export default router;