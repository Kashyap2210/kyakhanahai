// This component renders the main page of our website

import React from "react";
import Firstintrocomp from "./Firstintrocomp.jsx";
import Secondintrocomp from "./Secondintrocomp.jsx";
import Thirdintrocomp from "./Thirdintrocomp.jsx";
import { UserProfileContextProvider } from "../Context/UserContextProvider.jsx";
import Footer from "./Footer.jsx";
import "./index.css";

const VITE_APP_API_URL = import.meta.env.VITE_APP_API_URL;

export default function Mainpage() {
  return (
    <>
      <Firstintrocomp />
      <Secondintrocomp />
      <Thirdintrocomp />
      <Footer />
    </>
  );
}
