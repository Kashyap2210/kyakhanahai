import React, { useState } from "react";
import UserProfileContext from "./UserContext";

export const UserProfileContextProvider = ({ children }) => {
  const [userDetails, setUserDetails] = useState({
    name: "",
    username: "",
    password: "",
    address: "",
    phoneNumber: "",
    file: null,
    previewUrl: null,
    locality: "",
  });

  return (
    <UserProfileContext.Provider value={{ userDetails, setUserDetails }}>
      {children}
    </UserProfileContext.Provider>
  );
};

export default UserProfileContextProvider;
