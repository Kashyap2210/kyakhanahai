import React from "react";
import Firstintrocomp from "./Firstintrocomp.jsx";
import Secondintrocomp from "./Secondintrocomp.jsx";
import Thirdintrocomp from "./Thirdintrocomp.jsx";
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";
import Login from "./Login.jsx";
import { useState } from "react";

export default function Mainpage() {
  // const [showLoginPage, setShowLoginPage] = useState(false);

  // const handleLogin = () => {
  //   console.log("User requested to logIn");
  //   setShowLoginPage(true);
  // };

  return (
    <div>
      <Firstintrocomp />
      <Secondintrocomp />
      <Thirdintrocomp />
    </div>
  );
}
