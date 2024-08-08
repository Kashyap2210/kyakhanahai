import React, { useState, useEffect } from "react";
import UserProfileContext from "./UserContext";

export const UserProfileContextProvider = ({ children }) => {
  // Initialize state from localStorage, or with default values if localStorage is empty
  const [userDetails, setUserDetails] = useState(() => {
    const savedUserDetails = localStorage.getItem("userDetails");
    return savedUserDetails
      ? JSON.parse(savedUserDetails)
      : {
          name: "",
          username: "",
          password: "",
          address: "",
          phoneNumber: "",
          file: null,
          previewUrl: null,
          locality: "",
        };
  });

  // Update localStorage whenever userDetails changes
  useEffect(() => {
    localStorage.setItem("userDetails", JSON.stringify(userDetails));
  }, [userDetails]);

  console.log("Context Provider Rendered with userDetails:", userDetails);

  return (
    <UserProfileContext.Provider value={{ userDetails, setUserDetails }}>
      {children}
    </UserProfileContext.Provider>
  );
};

export default UserProfileContextProvider;
