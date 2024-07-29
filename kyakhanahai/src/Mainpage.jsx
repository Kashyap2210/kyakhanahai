// This component renders the main page of our website

import React from "react";
import Firstintrocomp from "./Firstintrocomp.jsx";
import Secondintrocomp from "./Secondintrocomp.jsx";
import Thirdintrocomp from "./Thirdintrocomp.jsx";

export default function Mainpage() {
  return (
    <div>
      <Firstintrocomp />
      <Secondintrocomp />
      <Thirdintrocomp />
    </div>
  );
}
