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
import ApprivedBids from "../../Components/MyBids/ApprivalBids";
import Footer from "../../Components/Footer/Footer";
import { useNavigate } from "react-router-dom";

function MyBids() {
  const navigate = useNavigate();
  const [selectedTask, setSelectedTask] = useState(null);
  const [approvalBidTask, setApprovalBidTask] = useState(null);
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

  if (approvalBidTask) {
    return (
      <ApprivedBids task={approvalBidTask} onBack={() => setApprovalBidTask(null)} />
    );
  }

  if (selectedTask) {
    return (
      <BidderView task={selectedTask} onBack={() => setSelectedTask(null)} />
    );
  }

  return (
  <>
    <Box sx={{ px: { xs: 1, sm: 2 }, py: { xs: 2, sm: 3 } }}>
      <Typography
        variant="h5"
        align="center"
        fontWeight="bold"
        mb={3}
        mt={3}
        sx={{ fontSize: { xs: "2.25rem", sm: "2.25rem" } }}
      >
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
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    {/* Header: Category and View */}
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      flexWrap="wrap"
                    >
                      <Typography
                        variant="subtitle1"
                        fontWeight="bold"
                        sx={{ fontSize: { xs: 15, sm: 16 } }}
                      >
                        Category: {task.Categories || "N/A"}
                      </Typography>

                      <Chip
                        label="View"
                        onClick={() => setSelectedTask(task)}
                        sx={{
                          bgcolor: color,
                          color: "white",
                          fontSize: 13,
                          px: 1,
                          mt: { xs: 1, sm: 0 },
                          cursor: "pointer",
                        }}
                      />
                    </Box>

                    {/* From/To or SubCategory + Delete */}
                    {task.Categories === "Transport" ? (
                      <Box mt={1} display="flex" flexDirection="column" gap={0.5}>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          fontWeight={600}
                          fontSize={14}
                        >
                          From: {task.from || "N/A"}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          fontWeight={600}
                          fontSize={14}
                        >
                          To: {task.to || "N/A"}
                        </Typography>
                      </Box>
                    ) : (
                      <Box
                        mt={1}
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        flexWrap="wrap"
                      >
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          fontWeight={600}
                          fontSize={14}
                        >
                          Sub Category: {task.SubCategory || "N/A"}
                        </Typography>
                        <IconButton
                          color="error"
                          size="small"
                          onClick={() => handleDelete(task.BidId)}
                          sx={{ mt: { xs: 1, sm: 0 } }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    )}

                    {/* Posted in & Bid Amount */}
                    <Box
                      mt={2}
                      display="flex"
                      justifyContent="space-between"
                      flexDirection={{ xs: "column", sm: "row" }}
                      alignItems={{ xs: "flex-start", sm: "center" }}
                      gap={1}
                    >
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        fontWeight={600}
                        fontSize={14}
                      >
                        Posted in: {task.createdAt?.substring(0, 10) || "N/A"}
                      </Typography>
                      <Typography
                        variant="body2"
                        fontWeight={600}
                        fontSize={14}
                        color="text.secondary"
                      >
                        Bid Amount: ₹{task.bidOfAmount || "0"}
                      </Typography>
                    </Box>

                    {/* Status Chip */}
                    <Box mt={2}>
                      <Chip
                        label={task.status || "Unknown"}
                        color={
                          task.status === "running"
                            ? "success"
                            : task.status === "pending"
                            ? "warning"
                            : "default"
                        }
                        sx={{
                          fontWeight: "bold",
                          textTransform: "capitalize",
                          fontSize: 13,
                          cursor: task.status === "running" ? "pointer" : "default",
                        }}
                        onClick={() => {
                          if (task.status === "running") {
                            setApprovalBidTask(task);
                          }
                        }}
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })
        ) : (
          <Grid item xs={12}>
            <Typography
              variant="body1"
              color="text.secondary"
              align="center"
              mt={5}
            >
              No bids found.
            </Typography>
          </Grid>
        )}
      </Grid>
    </Box>

    <Box mt={4}>
      <Footer />
    </Box>
  </>
);
  
}

export default MyBids;
