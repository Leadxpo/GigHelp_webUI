import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import BidderView from "../../Components/MyBids/BiddrsView";
import Footer from "../../Components/Footer/Footer";

function MyBids() {
  const [selectedTask, setSelectedTask] = useState(null);
  const [tasks, setTasks] = useState([]);
  const userDetail = JSON.parse(localStorage.getItem("user"));

  const colors = [
    "#2196f3", "#4caf50", "#ff9800", "#e91e63", "#9c27b0",
    "#00bcd4", "#f44336", "#3f51b5", "#8bc34a", "#ffc107",
    "#795548", "#607d8b", "#673ab7", "#009688", "#cddc39",
  ];

  useEffect(() => {
    const fetchBids = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/Bids/user/${userDetail.userId}`
        );
        setTasks(response.data?.data || []);
      } catch (error) {
        console.error("Error fetching bids:", error.response?.data || error.message);
      }
    };

    fetchBids();
  }, [userDetail?.userId]);

  const handleDelete = async (BidId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this bid?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:3001/Bids/delete/${BidId}`);
      setTasks((prev) => prev.filter((task) => task.BidId !== BidId));
    } catch (error) {
      console.error("Error deleting bid:", error.response?.data || error.message);
      alert("Failed to delete bid.");
    }
  };

  if (selectedTask) {
    return (
      <BidderView task={selectedTask} onBack={() => setSelectedTask(null)} />
    );
  }

  return (
    <>
      <Box sx={{ padding: 2 }}>
        <Typography variant="h4" align="center" fontWeight="bold" mb={3} mt={3}>
          My Bids
        </Typography>
        <Grid container spacing={2}>
          {tasks.length > 0 ? (
            tasks.map((task, index) => {
              const color = colors[index % colors.length];
              return (
                <Grid item xs={12} sm={6} md={4} key={index}>
<Card
  sx={{
    borderRadius: 2,
    boxShadow: 1,
    border: `1px solid ${color}`,
    display: "flex",
    flexDirection: "column",
  }}
>
  <CardContent sx={{ flexGrow: 1 }}>
    {/* Category and View Button */}
    <Box display="flex" justifyContent="space-between" alignItems="center">
      <Typography variant="h6" fontWeight="bold">
        Category: {task.Categories || "N/A"}
      </Typography>
      <Chip
        label="View"
        sx={{
          bgcolor: color,
          color: "white",
          fontSize: 14,
          padding: "5px 10px",
          cursor: "pointer",
        }}
        onClick={() => setSelectedTask(task)}
      />
    </Box>

    {/* SubCategory and Delete Icon in one line */}
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
      <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
        <Typography
          variant="body2"
          color="text.secondary"
          fontWeight={600}
          fontSize={16}
        >
          Sub Category: {task.SubCategory || "N/A"}
        </Typography>
        <IconButton color="error" onClick={() => handleDelete(task.BidId)}>
          <DeleteIcon />
        </IconButton>
      </Box>
    )}

    {/* Posted Date and Bid of Amount in one line */}
    <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
      <Typography
        variant="body2"
        color="text.secondary"
        fontWeight={600}
        fontSize={16}
      >
        Posted in: {task.createdAt?.substring(0, 10) || "N/A"}
      </Typography>
      <Box textAlign="right">
        <Typography
          variant="body2"
          fontWeight={600}
          fontSize={16}
          color="text.secondary"
        >
          Bid Amount:{`₹${task.bidOfAmount || "0"}`}
        </Typography>
        
      </Box>
    </Box>
  </CardContent>
</Card>


                </Grid>
              );
            })
          ) : (
            <Typography
              variant="body1"
              color="text.secondary"
              align="center"
              mt={5}
            >
              No bids found.
            </Typography>
          )}
        </Grid>
      </Box>

      <Footer />
    </>
  );
}

export default MyBids;
