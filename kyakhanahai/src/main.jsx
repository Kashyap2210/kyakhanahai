import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { createBrowserRouter, RouterProvider, Route } from "react-router-dom";

// Importing components for rendering for specific paths
import Mainpage from "./Mainpage.jsx";
import Login from "./Login";
import Signup from "./Signup";
import Adddish from "./Adddish";
import Showdish from "./Showdish";
import Getdish from "./Getdish";
import Checkplaces from "./Checkplaces";
import Profile from "./Profile";

const router = createBrowserRouter([
  // "createBrowserRouter" is used to create a router object with route definitions.

  {
    path: "/", //Defines the base path
    element: <App />, // App will contain the common layout
    children: [
      // Routes are defined & the components are assigned to that route so that when the request is sent on the route corresponding component will be rendered
      { path: "/", element: <Mainpage /> },
      { path: "/login", element: <Login /> },
      { path: "/signup", element: <Signup /> },
      { path: "/adddish", element: <Adddish /> },
      { path: "/showdish", element: <Showdish /> },
      { path: "/getdish", element: <Getdish /> },
      { path: "/checkplaces", element: <Checkplaces /> },
      { path: "/profile", element: <Profile /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
