import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import AuthContext from "./AuthProvider";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  // Commented out strict mode for now - causes components to render twice - was annoying me
  // https://support.boldreports.com/kb/article/12888/how-to-prevent-methods-from-being-called-twice-in-react#:~:text=This%20is%20because%20the%20StrictMode,js%20file.
  // Feel free to un-comment for debugging purposes
  // <React.StrictMode>
  //   <AuthContext>
  //   <App />
  //   </AuthContext>
  // </React.StrictMode>

  <AuthContext>
    <App />
  </AuthContext>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
