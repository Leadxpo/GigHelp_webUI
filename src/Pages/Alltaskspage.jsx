import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
} from "@mui/material";

import AddTaskDetails from "../Components/AddTasks/AddTaskDetails"; // Component

function HomepageComponent() {
  const [selectedTask, setSelectedTask] = useState(null);
  const [tasks, setTasks] = useState([]);

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
          setTasks(response.data.data);
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
      <Box sx={{ padding: 1 }}>
        <Typography variant="h4" align="center" fontWeight="bold" mb={3} mt={3}>
          All Tasks
        </Typography>
        <Grid container spacing={2}>
          {tasks.map((task, index) => (
            <Grid item xs={12} sm={6} md={4} key={index} sx={{ display: "flex" }}>
              <Card
                onClick={() => setSelectedTask(task)}
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: 2,
                  boxShadow: 1,
                  border: "2px solid #ddd",
                  cursor: "pointer",
                  width: "100%",
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
                        bgcolor: "primary.main",
                        color: "white",
                        fontSize: 16,
                        padding: "10px",
                      }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </div>
  );
}

export default HomepageComponent;
