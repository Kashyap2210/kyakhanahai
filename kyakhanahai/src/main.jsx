import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { createBrowserRouter, RouterProvider, Route } from "react-router-dom";
import Mainpage from "./Mainpage.jsx";
import Login from "./Login";
import Signup from "./Signup";
import Adddish from "./Adddish";
import Showdish from "./Showdish";
import Getdish from "./Getdish";
import Checkplaces from "./Checkplaces";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, // App will contain the common layout like Navbar
    children: [
      { path: "/", element: <Mainpage /> },
      { path: "/login", element: <Login /> },
      { path: "/signup", element: <Signup /> },
      { path: "/adddish", element: <Adddish /> },
      { path: "/showdish", element: <Showdish /> },
      { path: "/getdish", element: <Getdish /> },
      { path: "/checkplaces", element: <Checkplaces /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
