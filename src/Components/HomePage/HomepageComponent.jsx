import React, { useState, useEffect } from "react";
import axios from "axios";
import HomeImage from "../../Images/home.jpg";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
} from "@mui/material";
import AddTaskDetails from "../../Components/AddTasks/AddTaskDetails";
import Footer from "../../Components/Footer/Footer";
import { useLocation } from "react-router-dom";

function HomepageComponent() {
  const [selectedTask, setSelectedTask] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [filterTask, setFilterTask] = useState([]);

    const location = useLocation();
  const selectedCategory = location.state?.selectedCategory;
  
//   useEffect(() => {
//     const selectedCategory = location.state?.selectedCategory;

//     if (selectedCategory) {
//       const filterData = tasks.filter(task => task.Categories === selectedCategory);
//       setFilterTask(filterData);
//     } else {
//       setFilterTask(tasks); // fallback if no filter is selected
//     }
//   }, [location.state?.selectedCategory]);

//   useEffect(() => {
//     console.log("gggg",location.state?.budget)
//   const selectedBudget = location.state?.budget;

//   if (selectedBudget) {
//     const filterData = tasks.filter(task => task.amount <= selectedBudget);
//     setFilterTask(filterData);
//   } else {
//     setFilterTask(tasks); // fallback if no budget is selected
//   }
// }, [location.state?.budget]);




// useEffect(() => {
//   const selectedCategory = location.state?.category;
//   const fromLocation = location.state?.from;
//   const toLocation = location.state?.to;

//   if (selectedCategory && fromLocation && toLocation) {
//     const filteredData = tasks.filter(
//       (task) =>
//         task.Categories === selectedCategory &&
//         task.from === fromLocation &&
//         task.to === toLocation
//     );
//     setFilterTask(filteredData);
//   } else if (selectedCategory) {
//     const filteredData = tasks.filter((task) => task.Categories === selectedCategory);
//     setFilterTask(filteredData);
//   } else {
//     setFilterTask(tasks); // fallback if no filter is selected
//   }
// }, [location.state.category]);



  // Define an array of different colors for buttons (chips)
  useEffect(() => {
  const selectedCategory = location.state?.selectedCategory;
  const selectedSubCategory = location.state?.selectedSubCategory;
  const selectedBudget = location.state?.budget;
  const transportCategory = location.state?.category;
  const fromLocation = location.state?.from;
  const toLocation = location.state?.to;

  let filteredData = tasks;

  // Filter by selected category
  if (selectedCategory) {
    filteredData = filteredData.filter(
      (task) => task.Categories === selectedCategory
    );
  }

 // Filter by selected category
  if (selectedSubCategory) {
    filteredData = filteredData.filter(
      (task) => task.Categories === selectedSubCategory
    );
  }



  // Filter by budget
  if (selectedBudget) {
    filteredData = filteredData.filter(
      (task) => task.amount <= selectedBudget
    );
  }

  // Filter by Transport-specific category, from, and to
  if (transportCategory && fromLocation && toLocation) {
    filteredData = filteredData.filter(
      (task) =>
        task.Categories === transportCategory &&
        task.from === fromLocation &&
        task.to === toLocation
    );
  }

  setFilterTask(filteredData);
}, [tasks, location.state]);

  const colors = [
    "#2196f3", // Blue
    "#4caf50", // Green
    "#ff9800", // Orange
    "#e91e63", // Pink
    "#9c27b0", // Purple
    "#00bcd4", // Cyan
    "#f44336", // Red
    "#3f51b5", // Indigo
    "#8bc34a", // Light Green
    "#ffc107", // Amber
    "#795548", // Brown
    "#607d8b", // Blue Grey
    "#673ab7", // Deep Purple
    "#009688", // Teal
    "#cddc39"  // Lime
  ];
  
  useEffect(() => {
  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("Authorization token missing!");
        return;
      }

      const response = await axios.get("http://localhost:3001/task/get-all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        // Filter tasks where status is "verified"
        const verifiedTasks = response.data.data.filter(
          (task) => task.status === "verified"
        );

        setFilterTask(verifiedTasks);
        setTasks(verifiedTasks);
      } else {
        console.error("Failed to fetch tasks");
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  fetchTasks();
}, []);


  if (selectedTask) {
    return (
      <AddTaskDetails
        task={selectedTask}
        onBack={() => setSelectedTask(null)}
      />
    );
  }

  return (
    <div>
           {/* Hero Section with Text on Image */}
      <div style={{ position: "relative", width: "100%" }}>
        <img
          src={HomeImage}
          alt="Home"
          style={{
            width: "100%",
            height: "auto",
            borderRadius: "2px",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "25%",
            left: "5%",
            color: "white",
            fontSize: "1.5rem",
            // fontWeight: "bold",
            textShadow: "2px 2px 4px rgba(0,0,0,0.2)",
          }}
        >
      <h1>Empowering Your</h1>
      <h1>Vision , Building Your Future.</h1> 
        </div>
      </div>
      <Box sx={{ padding: 1 }}>
        <Typography variant="h4" align="center" fontWeight="bold" mb={3} mt={3}>
          All Tasks
        </Typography>
        <Grid container spacing={2}>
          {filterTask.length > 0 ? (
  filterTask.map((task, index) => (
    <Grid item xs={12} sm={6} md={4} key={index}>
      <Card
        onClick={() => setSelectedTask(task)}
        sx={{
          borderRadius: 2,
          boxShadow: 1,
          border: "2px solid #ddd",
          cursor: "pointer",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <CardContent sx={{ flexGrow: 1 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" fontWeight="bold">
              Category: {task.Categories}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {task.daysLeft}
            </Typography>
          </Box>

{task.Categories === "Transport" ? (
   <Box mt={1} display="flex" gap={2}>
    <Typography
      variant="body2"
      color="text.secondary"
      fontWeight={600}
      fontSize={16}
    >
      From: {task.from || "N/A"}
    </Typography>
    <Typography
      variant="body2"
      color="text.secondary"
      fontWeight={600}
      fontSize={16}
    >
      To: {task.to || "N/A"}
    </Typography>
  </Box>
) : (
  <Typography
    variant="body2"
    color="text.secondary"
    mt={1}
    fontWeight={600}
    fontSize={16}
  >
    Sub Category: {task.SubCategory || "N/A"}
  </Typography>
)}


          <Box display="flex" justifyContent="space-between" mt={1}>
            <Typography
              variant="body2"
              color="text.secondary"
              fontWeight={600}
              fontSize={16}
            >
              Posted in: {new Date(task.createdAt).toLocaleDateString()}
            </Typography>

            <Chip
              label={`₹${task.amount}`}
              sx={{
                bgcolor: colors[index % colors.length],
                color: "white",
                fontSize: 16,
                padding: "10px",
              }}
            />
          </Box>
        </CardContent>
      </Card>
    </Grid>
  ))
) : (
  <Typography variant="h6" textAlign="center" width="100%">
    Data Not Available
  </Typography>
)}

        </Grid>
      </Box>

      <div>
        <Footer />
      </div>
    </div>
  );
}

export default HomepageComponent;
