import { useState, useEffect } from "react";
import "./index.css";
import Navbarelements from "./Navbarelements";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import RestaurantIcon from "@mui/icons-material/Restaurant";

export default function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication status on component mount
    const checkAuth = async () => {
      try {
        const response = await axios.get("http://localhost:3000/checkAuth", {
          withCredentials: true,
        });
        setIsAuthenticated(response.data.authenticated);
      } catch (error) {
        console.error("Error checking authentication status:", error);
      }
    };

    checkAuth();
    const intervalId = setInterval(checkAuth, 1000);
    return () => clearInterval(intervalId);
  }, []);

  const handleLogout = async () => {
    console.log("Logout Request Sent From Frontend");
    try {
      await axios.post(
        "http://localhost:3000/logout",
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
          <Navbarelements title={`@kyakhanahai.com`} />
        </Link>
      </div>
      <div className="flex justify-between items-center text-center pr-8 z-9999">
        <Link to="/">
          <Navbarelements title={"About"} />
        </Link>
        {isAuthenticated ? (
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
