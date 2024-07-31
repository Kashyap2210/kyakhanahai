import { useState, useEffect } from "react";
import "./index.css";
import Navbarelements from "./Navbarelements";
import { Link } from "react-router-dom"; //Link is used to give useNavigate a link to certain element
import { useNavigate } from "react-router-dom";
import axios from "axios";
// import RestaurantIcon from "@mui/icons-material/Restaurant";

export default function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false); //isAuthenticated state is used to display seperate navbar elements depending on whether the user is loggedin or not
  const navigate = useNavigate();

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
    <div
      className={
        "navbar bg-white border-b border-gray-500 h-20 flex justify-between items-center text-2xl font-bold fixed top-0 w-full opacity-100"
      }
    >
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
          <Link onClick={handleLogout}>
            <Navbarelements title={"Logout"} />
          </Link>
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
      </div>
    </div>
  );
}
