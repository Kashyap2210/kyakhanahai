import React from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./index.css";

export default function Showdish() {
  const navigate = useNavigate();

  const location = useLocation();
  const dishes = location.state?.dishes || [];

  const showRemainingDishes = async () => {
    try {
      console.log("inside try block");
      const response = await axios.get("http://localhost:3000/showdish", {
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
        "http://localhost:3000/deletedish",
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
    <div className="h-screen mt-20">
      <h1>Added Dishes</h1>
      {dishes.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th className="hidden">ID</th>
              <th>Name</th>
              <th>Category</th>
              <th>Type</th>
            </tr>
          </thead>
          <tbody>
            {dishes.map((dish) => (
              <tr key={dish.id}>
                <td className="hidden">{dish.id}</td>
                <td>{dish.name}</td>
                <td>{dish.category}</td>
                <td>{dish.type}</td>
                <td>
                  <button onClick={() => deleteDish(dish.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No dishes found.</p>
      )}
    </div>
  );
}

// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import "./index.css";

// export default function Showdish() {
//   const navigate = useNavigate();
//   const [dishes, setDishes] = useState([]);

//   useEffect(() => {
//     fetchDishes();
//   }, []);

//   const fetchDishes = async () => {
//     try {
//       const response = await axios.get("http://localhost:3000/showdish", {
//         withCredentials: true,
//       });

//       if (response.status === 200) {
//         setDishes(response.data);
//       } else {
//         console.log("Fetching dishes failed");
//         navigate("/login");
//       }
//     } catch (error) {
//       console.error("Error fetching dishes:", error);
//       if (error.response && error.response.status === 401) {
//         navigate("/login");
//       }
//     }
//   };

//   const deleteDish = async (id) => {
//     try {
//       const response = await axios.post(
//         "http://localhost:3000/deletedish",
//         { id },
//         { withCredentials: true }
//       );

//       if (response.status === 200) {
//         fetchDishes(); // Refresh the list after deletion
//       } else {
//         console.log("Deleting the dish failed");
//       }
//     } catch (error) {
//       console.error("Error deleting dish:", error);
//     }
//   };

//   return (
//     <div>
//       <h1>Added Dishes</h1>
//       {dishes.length > 0 ? (
//         <table>
//           <thead>
//             <tr>
//               <th className="hidden">ID</th>
//               <th>Name</th>
//               <th>Category</th>
//               <th>Type</th>
//               <th>Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {dishes.map((dish) => (
//               <tr key={dish.id}>
//                 <td className="hidden">{dish.id}</td>
//                 <td>{dish.name}</td>
//                 <td>{dish.category}</td>
//                 <td>{dish.type}</td>
//                 <td>
//                   <button onClick={() => deleteDish(dish.id)}>Delete</button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       ) : (
//         <p>No dishes found.</p>
//       )}
//     </div>
//   );
// }
