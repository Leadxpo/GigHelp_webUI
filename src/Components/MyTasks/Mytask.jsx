import React, { useEffect, useState } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Modal,
  Button,
} from "@mui/material";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import AssignTask from "../../Components/MyTasks/AssignTaskDetails";
import TaskBidder from "../../Components/MyTasks/TaskBiders";
import Footer from "../../Components/Footer/Footer";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import ApiService from "../../services/ApiServices";

function Mytask() {
  const [selectedTask, setSelectedTask] = useState(null);
  const [showTaskBidder, setShowTaskBidder] = useState(false);
  const [showKYCModal, setShowKYCModal] = useState(false); // New Modal State
  const [tasks, setTasks] = useState([]);
  const [currentTask, setCurrentTask] = useState({});
  const navigate = useNavigate(); // React Router Hook

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem("token");
        const userData = JSON.parse(localStorage.getItem("user"));

        if (!token || !userData || !userData.userId) {
          alert("Authorization token or user data missing!");
          return;
        }

        const userId = userData.userId;

        const response = await ApiService.post(
          "/task/get-task-by-user",
          {
            userId: userId,
          },
        );

        const tasksWithColors = response.data.map((task) => ({
          ...task,
          color: getColorByStatus(task.status),
        }));

        setTasks(tasksWithColors);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        if (error.response && error.response.status === 401) {
          alert("Unauthorized! Please login again.");
        }
      }
    };

    fetchTasks();
  }, []);

  const handleDelete = async (taskId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this Task?"
    );
    if (!confirmDelete) return;

    const token = localStorage.getItem("token"); // Get token from localStorage

    try {
      await ApiService.delete(`/task/delete/${taskId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Add token in Authorization header
        },
      });

      setTasks((prev) => prev.filter((task) => task.taskId !== taskId));
    } catch (error) {
      console.error(
        "Error deleting bid:",
        error.response?.data || error.message
      );
      alert("Failed to delete bid.");
    }
  };

  const getColorByStatus = (status) => {
    switch (status) {
      case "pending":
        return "orange";
      case "verified":
        return "green";
      case "rejected":
        return "red";
      case "completed":
        return "#2196f3";
      case "running":
        return "purple";
      default:
        return "gray";
    }
  };

  // if (selectedTask) {
  //   console.log("Assign Task is opened");
  //   return <AssignTask task={selectedTask} />;
  // }

  // if (showTaskBidder) {
  //   console.log("Task bar is opened");
  //   return <TaskBidder task={currentTask} />;
  // }

  return (
    <>
      <Box sx={{ padding: 1 }}>
        <Typography variant="h4" align="center" fontWeight="bold" mb={3} mt={2}>
          My Tasks
        </Typography>

        <Grid container spacing={2}>
          {tasks.map((task, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  borderRadius: 2,
                  boxShadow: 1,
                  border: `1px solid ${task.color}`,
                  display: "flex",
                  flexDirection: "column",
                  cursor: "pointer",
                }}
                // onClick={() => {
                //   if (task.status === "running") {
                //     setSelectedTask(task);
                //   } else if (task.status === "rejected") {
                //     setShowKYCModal(true);
                //   } else if (task.status === "verified") {
                //     setShowTaskBidder(true);
                //     setCurrentTask(task);
                //   }
                // }}
                onClick={(e) => {
                  e.stopPropagation();

                  if (
                    task.status === "assigned" ||
                    task.status === "paymentRequested" ||
                    task.status === "completed"
                  ) {
                    // navigate("AssignTask", { task });
                    navigate(`/mytasks/assigned-task/${task.taskId}`, {
                      state: { task },
                    });
                  } else if (task.status === "disputed") {
                    navigate("DisputeRaised", { task });
                  } else {
                    // navigate("TaskBidder", { task });
                    navigate(`/my-tasks/${task.taskId}`, {
                      state: { task },
                    });
                  }

                  // if (task.status === "pending") {
                  //   navigate(`/mytasks/task/${task.taskId}`, {
                  //     state: { task },
                  //   });
                  // } else if (task.status === "rejected") {
                  //   setShowKYCModal(true);
                  // } else if (task.status === "verified") {
                  //   navigate(`/mytasks/assigned-task/${task.taskId}`, {
                  //     state: { task },
                  //   });
                  // }
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography variant="h6" fontWeight="bold">
                      Category: {task.Categories}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {task.daysLeft}
                    </Typography>
                  </Box>

                  {task.Categories === "Transport" ? (
                    <Box
                      mt={1}
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Box display="flex" gap={2}>
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
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent card click
                          handleDelete(task.taskId); // Call delete function
                        }}
                      >
                        <DeleteIcon color="error" />
                      </IconButton>
                    </Box>
                  ) : (
                    <Box
                      mt={1}
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        fontWeight={600}
                        fontSize={16}
                      >
                        Sub Category: {task.SubCategory || "N/A"}
                      </Typography>
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent card click
                          handleDelete(task.taskId); // Call delete function
                        }}
                      >
                        <DeleteIcon color="error" />
                      </IconButton>
                    </Box>
                  )}

                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mt={2}
                  >
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      fontWeight={600}
                      fontSize={16}
                    >
                      Posted in: {moment(task.createdAt).format("DD-MM-YYYY")}
                    </Typography>

                    <Chip
                      label={task.amount}
                      sx={{
                        bgcolor: task.color,
                        color: "white",
                        fontSize: 16,
                        padding: "10px",
                        cursor: "pointer",
                      }}
                      // onClick={(e) => {
                      //   e.stopPropagation();
                      //   if (task.status === "pending") {
                      //     setShowTaskBidder(true);
                      //     setCurrentTask(task);
                      //   } else if (task.status === "rejected") {
                      //     setShowKYCModal(true);
                      //   } else if (task.status === "verified") {
                      //     setSelectedTask(task);
                      //   }
                      // }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Modal for KYC Rejected */}
        <Modal
          open={showKYCModal}
          onClose={() => setShowKYCModal(false)}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              width: 350,
              bgcolor: "white",
              borderRadius: 4,
              boxShadow: 24,
              textAlign: "center",
              overflow: "hidden",
            }}
          >
            <Box sx={{ bgcolor: "red", py: 2 }}>
              <Typography variant="h6" color="white">
                ⚠️ Whoops
              </Typography>
            </Box>
            <Box px={3} py={2}>
              <Typography variant="h6" fontWeight="bold" mt={1}>
                KYC
              </Typography>
              <Typography mt={1}>
                Under Process. You can't add a task.
              </Typography>
              <Button
                variant="contained"
                fullWidth
                sx={{
                  mt: 3,
                  bgcolor: "#ccc",
                  color: "#333",
                  fontWeight: "bold",
                }}
                onClick={() => {
                  setShowKYCModal(false);
                  // navigate("/dashboard/profile"); // Change path if your profile route is different
                }}
              ></Button>
            </Box>
          </Box>
        </Modal>
      </Box>
      <div>
        <Footer />
      </div>
    </>
  );
}

export default Mytask;
