import React from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./index.css";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

export default function Showdish() {
  const navigate = useNavigate();

  const location = useLocation();
  const dishes = location.state?.dishes || [];

  const showRemainingDishes = async () => {
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
        console.log("Login failed");
      }
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  const deleteDish = async (id) => {
    try {
      console.log("inside try block");
      const response = await axios.post(
        "http://localhost:3000/api/deletedish",
        {
          id,
        },
        { withCredentials: true }
      );
      console.log("Request sent");

      if (response.status === 200) {
        showRemainingDishes();
        console.log("Deleted");
      } else {
        console.log("Deleteing the dish failed");
      }
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  return (
    <div className="pt-16 gap-16 flex flex-col justify-around">
      <div>
        <h1 className="text-center mt-8 text-4xl font-bold	">Added Dishes</h1>
      </div>
      <div className=" flex justify-center items-center mb-16">
        {dishes.length > 0 ? (
          <table className="table-auto border border-black ">
            <thead className="border border-black">
              <tr className="border border-black">
                <th className="hidden">ID</th>
                <th className="border border-black p-4">Name</th>
                <th className="border border-black p-4">Category</th>
                <th className="border border-black p-4">Type</th>
              </tr>
            </thead>
            <tbody>
              {dishes.map((dish) => (
                <tr key={dish.id}>
                  <td className="hidden">{dish.id}</td>
                  <td className="border border-black p-4">{dish.name}</td>
                  <td className="border border-black p-4">{dish.category}</td>
                  <td className="border border-black p-4">{dish.type}</td>
                  <td className="border border-black p-4">
                    <button onClick={() => deleteDish(dish.id)}>
                      <DeleteOutlineIcon color="secondary"></DeleteOutlineIcon>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No dishes found.</p>
        )}
      </div>
    </div>
  );
}
