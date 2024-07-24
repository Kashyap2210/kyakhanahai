import { Link } from "react-router-dom";
import "./index.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";

export default function Secondintrocomp() {
  const navigate = useNavigate();
  const showDish = async (e) => {
    e.preventDefault();
    try {
      console.log("inside try block");
      const response = await axios.get("http://localhost:3000/api/showdish", {
        withCredentials: true,
      });
      console.log("Request sent");

      if (response.status === 200) {
        navigate("/showdish", { state: { dishes: response.data } });
        console.log("Navigated");
      } else {
        navigate("/login");
        console.log("Login failed");
      }
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  const getDish = async (e) => {
    e.preventDefault();
    try {
      // Check if user is authenticated
      const authResponse = await axios.get(
        "http://localhost:3000/api/checkAuth",
        {
          withCredentials: true,
        }
      );
      if (!authResponse.data.authenticated) {
        // Redirect to login page if not authenticated
        alert("Please Login To See What You Are Eating");
        navigate("/login");
        return;
      }
      navigate("/getdish");
      console.log("inside try block");
      const response = await axios.get("http://localhost:3000/api/getdish", {
        withCredentials: true,
      });
      console.log("Request sent");

      if (response.status === 200) {
        navigate("/getdish", { state: { dish: response.data } });
        console.log(response.data);
        console.log("Navigated");
      } else {
        console.log("Login failed");
      }
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  return (
    <div>
      <div className="main-content flex items-center justify-between bg-white">
        <img src="second_intro.jpg" alt="" className="w-1/2 main-content" />
        <p className="w-1/2">
          <i>How do we do it?</i>
          <br />
          We take info from you about what you eat regularly & select a random
          dish for you from yout persomalised data.
          <br />
          <br />
          <Link to="/adddish">
            <Button variant="outlined" className="h-8 border" color="secondary">
              Add Dish
            </Button>
          </Link>
          &nbsp;&nbsp;&nbsp;
          <Link to="/showdish">
            <Button
              variant="outlined"
              className="h-8 border"
              color="secondary"
              onClick={showDish}
            >
              See added dishes
            </Button>
          </Link>
          &nbsp;&nbsp;&nbsp;
          <Link to="/getdish">
            <Button
              variant="outlined"
              className="h-8  border"
              color="secondary"
              onClick={getDish}
            >
              Generate Dish
            </Button>
          </Link>
        </p>
      </div>
    </div>
  );
}
