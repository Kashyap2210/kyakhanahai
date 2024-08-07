import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import UserProfileContext from "../Context/UserContext";
import { useNavigate } from "react-router-dom";
import PinDropIcon from "@mui/icons-material/PinDrop";
import PhoneIcon from "@mui/icons-material/Phone";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom"; //Link is used to give useNavigate a link to certain element

export default function Profile() {
  const { userDetails, setUserDetails } = useContext(UserProfileContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userResponse = await axios.get("http://localhost:3000/api/user", {
          withCredentials: true,
        });
        console.log(userResponse.data);
        // Update context with user details
        setUserDetails(userResponse.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user details:", error);
        setLoading(false);
        navigate("/"); // Redirect to home if there's an error
      }
    };

    // Fetch user details if not already present
    if (!userDetails) {
      fetchUserDetails();
    } else {
      setLoading(false);
    }
  }, [userDetails, setUserDetails, navigate]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!userDetails || !userDetails.username) {
    return <p>No user details available. Please log in again.</p>; // Redirect or show message
  }

  const profilePicUrl = userDetails.profilePic
    ? `http://localhost:3000/${userDetails.profilePic}`
    : "";

  const deleteUser = async () => {
    try {
      const deleteAccount = await axios.delete(
        "http://localhost:3000/api/deleteaccount",
        {
          data: { userId: userDetails._id }, // Sending additional data
          withCredentials: true,
        }
      );
      if (deleteAccount.status === 200) {
        console.log("Account Deleted");
      }
    } catch {
      (error) => {
        console.error("Error deleting account:", error);
      };
    }
  };

  return (
    // This is the grand container div
    <div className="container  py-16 px-20 flex  items-center align-center justify-center	">
      {" "}
      {/* LHS Section Starts Here */}
      <div className="lhs-side  flex gap-4 flex-col items-center align-center  w-1/2">
        <div className="w-60 h-60  rounded-full">
          {userDetails.profilePic ? (
            <img src={profilePicUrl} alt="Profile" className="rounded-full" />
          ) : (
            "No image available"
          )}
        </div>
        <div className="text-4xl font-semibold	">
          {userDetails.name || "Not available"}
        </div>
        <div className="text-xl font-normal	">
          {userDetails.email || "Not available"}
        </div>
      </div>
      {/* LHS Section Ends Here */}
      {/* RHS Section Starts Here */}
      <div className="rhs-side h-100 flex gap-12 flex-col items-center align-center w-1/2">
        <div className="text-4xl">
          <PinDropIcon sx={{ fontSize: 36, lineHeight: 40 }} />
          {userDetails.profile?.address || "Not available"}
        </div>
        <div className="text-4xl">
          <PinDropIcon sx={{ fontSize: 36, lineHeight: 40 }} />
          Locality: {userDetails.profile?.locality || "Not available"}
        </div>
        <div className="text-xl font-normal	">
          <PhoneIcon sx={{ marginRight: 1 }} />
          {userDetails.profile?.phone || "Not available"}
        </div>
        <div>
          <Link to="/showdish">
            <Button color="secondary" variant="contained">
              See Your Dishes
            </Button>
          </Link>
        </div>
        <div>
          <Link to="/">
            <Button color="secondary" variant="contained" onClick={deleteUser}>
              Delete Account
            </Button>
          </Link>
        </div>
      </div>
      {/* RHS Section Ends Here */}
    </div>
  );
}
