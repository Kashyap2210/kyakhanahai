import { useState, useEffect, useContext } from "react";
import "./index.css";
import Navbarelements from "./Navbarelements";
import { Link } from "react-router-dom"; //Link is used to give useNavigate a link to certain element
import { useNavigate } from "react-router-dom";
import axios from "axios";
import UserProfileContext from "../Context/UserContext";

// import RestaurantIcon from "@mui/icons-material/Restaurant";

export default function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false); //isAuthenticated state is used to display seperate navbar elements depending on whether the user is loggedin or not
  const { userDetails, setUserDetails } = useContext(UserProfileContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const profilePicUrl = userDetails.profilePic
    ? `http://localhost:3000/${userDetails.profilePic}`
    : "";

  useEffect(() => {
    // Check authentication status on component mount
    const checkAuth = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/checkAuth",
          {
            withCredentials: true, //This is used to send data with req, like session cookies
          }
        );
        setIsAuthenticated(response.data.authenticated); //sets the value of state with the data recieved from the backend
      } catch (error) {
        console.error("Error checking authentication status:", error);
      }
    };

    checkAuth(); //Function is called to check the authentication
    const intervalId = setInterval(checkAuth, 1000); //Sets periodic timer that calls checkAuth every second.
    return () => clearInterval(intervalId); //Cleanup function to clear the interval
  }, []);

  // useEffect(() => {
  //   const fetchUserDetails = async () => {
  //     try {
  //       const userResponse = await axios.get("http://localhost:3000/api/user", {
  //         withCredentials: true,
  //       });
  //       console.log(userResponse.data);
  //       // Update context with user details
  //       setUserDetails(userResponse.data);
  //       setLoading(false);
  //     } catch (error) {
  //       console.error("Error fetching user details:", error);
  //       setLoading(false);
  //       navigate("/"); // Redirect to home if there's an error
  //     }
  //   };

  //   // Fetch user details if not already present
  //   if (!userDetails) {
  //     fetchUserDetails();
  //   } else {
  //     setLoading(false);
  //   }
  // }, [userDetails, setUserDetails, navigate]);

  // if (loading) {
  //   return <p>Loading...</p>;
  // }

  // if (!userDetails || !userDetails.username) {
  //   return <p>No user details available. Please log in again.</p>; // Redirect or show message
  // }

  const handleLogout = async () => {
    //Function to log out the user & also sets the state of isAuthenticated to false
    console.log("Logout Request Sent From Frontend");
    try {
      await axios.post(
        "http://localhost:3000/api/logout",
        {},
        {
          withCredentials: true,
        }
      );
      setIsAuthenticated(false);
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div className="navbar glass sticky top-0  pt-4">
      <div className={" bg-fuchsia-700 mx-auto max-w-6xl rounded-3xl"}>
        {" "}
        {/*I want to set the width of the nav bar it should not change according to the page */}
        <div className="h-12 flex justify-between items-center  text-xl font-bold">
          <div className=" text-center">
            <Link to="/">
              {/* Navbarelements are seperate elements for displaying on the navbar. Which Navbarelement will be displayed will depend on the state variable isAuthenticated */}
              <Navbarelements title={`@kyakhanahai.com`} />
            </Link>
          </div>
          <div className="flex justify-between items-center text-center pr-8">
            <Link to="/">
              <Navbarelements title={"About"} />
            </Link>
            {isAuthenticated ? (
              // COnditional rendering based on the state variable value
              <div>
                <Link onClick={handleLogout}>
                  <Navbarelements title={"Logout"} />
                </Link>
              </div>
            ) : (
              <>
                <Link to="/login">
                  <Navbarelements title={"Login"} />
                </Link>
                <Link to="/signup">
                  <Navbarelements title={"Signup"} />
                </Link>
              </>
            )}
            {isAuthenticated ? (
              // COnditional rendering based on the state variable value
              <div>
                <Link to="/profile">
                  <div className="  ml-20 bg-fuchsia-700	text-white">
                    {profilePicUrl ? (
                      <img
                        src={profilePicUrl}
                        alt=""
                        className="h-8 rounded-full"
                      />
                    ) : (
                      <p className="border w-8 rounded-full border-2">U</p>
                    )}
                  </div>
                </Link>
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
