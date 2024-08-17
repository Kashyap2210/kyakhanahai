import { useState, useEffect, useContext } from "react";
import "./index.css";
import Navbarelements from "./Navbarelements";
import { Link } from "react-router-dom"; //Link is used to give useNavigate a link to certain element
import { useNavigate } from "react-router-dom";
import axios from "axios";
import UserProfileContext from "../Context/UserContext";

// import RestaurantIcon from "@mui/icons-material/Restaurant";

const VITE_APP_API_URL =
  import.meta.env.VITE_APP_API_URL || "https://kyakhanahai.onrender.com";

export default function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false); //isAuthenticated state is used to display seperate navbar elements depending on whether the user is loggedin or not
  const { userDetails, setUserDetails } = useContext(UserProfileContext);
  const navigate = useNavigate();
  // const [loading, setLoading] = useState(true);

  const profilePicUrl = userDetails?.profilePic;

  useEffect(() => {
    // Check authentication status on component mount
    const checkAuth = async () => {
      try {
        const response = await axios.get(`${VITE_APP_API_URL}/api/checkAuth`, {
          withCredentials: true, //This is used to send data with req, like session cookies
        });
        setIsAuthenticated(response.data.authenticated); //sets the value of state with the data recieved from the backend
      } catch (error) {
        console.error("Error checking authentication status:", error);
      }
    };

    checkAuth(); //Function is called to check the authentication
    const intervalId = setInterval(checkAuth, 30000); //Sets periodic timer that calls checkAuth every second.
    return () => clearInterval(intervalId); //Cleanup function to clear the interval
  }, []);

  const handleLogout = async () => {
    //Function to log out the user & also sets the state of isAuthenticated to false
    console.log("Logout Request Sent From Frontend");
    try {
      await axios.post(
        `${VITE_APP_API_URL}/api/logout`,
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
      <div className={"bg-fuchsia-700 mx-auto max-w-6xl rounded-3xl"}>
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
                <div onClick={handleLogout} className="cursor-pointer">
                  <Navbarelements title={"Logout"} />
                </div>
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
                  <div className="ml-20 bg-fuchsia-700 text-white">
                    {profilePicUrl ? (
                      <img
                        src={profilePicUrl}
                        alt=""
                        className="h-8 rounded-full"
                      />
                    ) : (
                      <p className=" w-8 rounded-full border-2">U</p>
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
