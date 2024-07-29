import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

function App() {
  return (
    <>
      <Navbar />
      <Outlet />
      {/* Outlet allows us to change the maincontent of the page and populate different components. Outlet manages the nested routing in our code */}
      <Footer />
    </>
  );
}

export default App;
