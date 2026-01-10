import React, { useState, useEffect } from "react";
import HomeImage from "../../Images/home.jpg";
import Divider from "@mui/material/Divider";
import { Grid, Card, CardContent, Typography, Box, Chip } from "@mui/material";
import Star from "@mui/icons-material/Star";
import Person from "@mui/icons-material/Person";
import AccessTime from "@mui/icons-material/AccessTime";
import CategoryIcon from "@mui/icons-material/Category";
import SubdirectoryArrowRightIcon from "@mui/icons-material/SubdirectoryArrowRight";

import AddTaskDetails from "../../Components/AddTasks/AddTaskDetails";
import Footer from "../../Components/Footer/Footer";
import { useLocation, useNavigate } from "react-router-dom";
import ApiService from "../../services/ApiServices";

function HomepageComponent() {
  const [selectedTask, setSelectedTask] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [filterTask, setFilterTask] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [bids, setBids] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (!storedUser) return;

        setUserInfo(storedUser);
        const userId = Number(storedUser.userId);

        // const [tasksRes, bidsRes] = await Promise.all([
        //   ApiService.get("/task/get-all"),
        //   ApiService.get(`/Bids/user/${userId}`),
        // ]);
        const tasksRes = await ApiService.get("task/get-all");
        const bidsRes = await ApiService.get(
          `/Bids/user/${storedUser.userId}`
        );

        if (tasksRes.success && bidsRes.success) {
          const bidTaskIds = bidsRes.data.map((b) =>
            Number(b.taskId)
          );

          // ✅ SAME FILTER AS RN
          const filteredTasks = tasksRes.data.filter((task) => {
            const taskOwnerId = Number(task.userId || task.taskUserId);
            const taskId = Number(task.taskId);

            return (
              taskOwnerId !== userId && !bidTaskIds.includes(taskId)
            );
          });

          setTasks(filteredTasks);
          setFilterTask(filteredTasks);
          setBids(bidsRes.data);
        }
      } catch (err) {
        console.error("API error:", err);
      }
    };

    fetchData();
  }, []);

  // useEffect(() => {
  //   const fetchUserAndBids = async () => {
  //     try {
  //       const storedUser = JSON.parse(localStorage.getItem("userInfo"));
  //       if (!storedUser) return;

  //       setUserInfo(storedUser);

  //       const bidsResponse = await ApiService.get(
  //         `/Bids/user/${storedUser.userId}`
  //       );

  //       if (bidsResponse?.success) {
  //         setBids(bidsResponse.data);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching bids:", error);
  //     }
  //   };

  //   fetchUserAndBids();
  // }, []);

  const navigate = useNavigate();

  const location = useLocation();

  const colors = [
    "#2196f3",
    "#4caf50",
    "#ff9800",
    "#e91e63",
    "#9c27b0",
    "#00bcd4",
    "#f44336",
    "#3f51b5",
    "#8bc34a",
    "#ffc107",
    "#795548",
    "#607d8b",
    "#673ab7",
    "#009688",
    "#cddc39",
  ];

  // useEffect(() => {
  //   const fetchTasks = async () => {
  //     try {
  //       const response = await ApiService.get("task/get-all");

  //       if (response.success) {
  //         const verifiedTasks = response.data.filter(
  //           (task) => task.status === "verified"
  //         );
  //         setFilterTask(verifiedTasks);
  //         setTasks(verifiedTasks);
  //       } else {
  //         console.error("Failed to fetch tasks");
  //       }
  //     } catch (error) {
  //       console.error("Error fetching tasks:", error);
  //     }
  //   };

  //   fetchTasks();
  // }, []);

  useEffect(() => {
    const selectedCategory = location.state?.selectedCategory;
    const selectedSubCategory = location.state?.selectedSubCategory;
    const selectedBudget = location.state?.budget;
    const transportCategory = location.state?.category;
    const fromLocation = location.state?.from;
    const toLocation = location.state?.to;

    let filteredData = tasks;

    if (selectedCategory) {
      filteredData = filteredData.filter(
        (task) => task.Categories === selectedCategory
      );
    }

    if (selectedSubCategory) {
      filteredData = filteredData.filter(
        (task) => task.Categories === selectedSubCategory
      );
    }

    if (selectedBudget) {
      filteredData = filteredData.filter(
        (task) => task.amount <= selectedBudget
      );
    }

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

  if (selectedTask) {
    return (
      <AddTaskDetails
        task={selectedTask}
        onBack={() => setSelectedTask(null)}
      />
    );
  }

  // const handleTaskClick = (task) => {
  //   navigate(`/task-details/${task.taskId}`, { state: { task } });
  // };
  const handleTaskClick = (task, alreadyBidded) => {
    navigate(`/task-details/${task.taskId}`, { state: { task } });
    // setSelectedTask({ ...task, alreadyBidded });
  };

  return (
    <div>
      {/* Hero Section */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: { xs: 200, sm: 300, md: 400, lg: 500 },
        }}
      >
        <img
          src={HomeImage}
          alt="Home"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderRadius: "2px",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            top: "20%",
            left: "5%",
            color: "white",
            textShadow: "2px 2px 4px rgba(0,0,0,0.4)",
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontSize: { xs: "1.2rem", sm: "1.8rem", md: "2rem", lg: "3rem" },
              fontWeight: "bold",
            }}
          >
            Empowering Your
          </Typography>
          <Typography
            variant="h5"
            sx={{
              fontSize: { xs: "1.2rem", sm: "1.8rem", md: "2rem", lg: "3rem" },
              fontWeight: "bold",
            }}
          >
            Vision, Building Your Future.
          </Typography>
        </Box>
      </Box>

      {/* Task List */}
      <Box sx={{ px: { xs: 1, sm: 2, md: 4 }, py: 3 }}>
        <Typography
          variant="h4"
          align="center"
          fontWeight="bold"
          sx={{ fontSize: { xs: 24, sm: 30, md: 34 }, mb: 3 }}
        >
          All Tasks
        </Typography>

        <Grid container spacing={2}>
          {filterTask.length > 0 ? (
            filterTask.map((task, index) => (
              // <Grid item xs={12} sm={6} md={4} key={index}>
              //   <Card
              //     // onClick={() => setSelectedTask(task)}
              //     onClick={() => handleTaskClick(task)}
              //     sx={{
              //       borderRadius: 2,
              //       boxShadow: 2,
              //       border: "2px solid #ddd",
              //       cursor: "pointer",
              //       height: "100%",
              //       display: "flex",
              //       flexDirection: "column",
              //       transition: "0.3s",
              //       "&:hover": {
              //         boxShadow: 6,
              //         transform: "scale(1.02)",
              //       },
              //     }}
              //   >
              //     <CardContent sx={{ flexGrow: 1 }}>
              //       <Box
              //         display="flex"
              //         justifyContent="space-between"
              //         alignItems="center"
              //       >
              //         <Typography
              //           variant="h6"
              //           sx={{
              //             fontSize: { xs: 14, sm: 16, md: 18 },
              //             fontWeight: "bold",
              //           }}
              //         >
              //           Category: {task.Categories}
              //         </Typography>
              //         <Typography variant="body2" color="textSecondary">
              //           {task.daysLeft}
              //         </Typography>
              //       </Box>

              //       {task.Categories === "Transport" ? (
              //         <Box
              //           mt={1}
              //           display="flex"
              //           flexDirection={{ xs: "column", sm: "row" }}
              //           gap={2}
              //         >
              //           <Typography
              //             variant="body2"
              //             color="text.secondary"
              //             fontWeight={600}
              //             fontSize={16}
              //           >
              //             From: {task.from || "N/A"}
              //           </Typography>
              //           <Typography
              //             variant="body2"
              //             color="text.secondary"
              //             fontWeight={600}
              //             fontSize={16}
              //           >
              //             To: {task.to || "N/A"}
              //           </Typography>
              //         </Box>
              //       ) : (
              //         <Typography
              //           variant="body2"
              //           color="text.secondary"
              //           mt={1}
              //           fontWeight={600}
              //           fontSize={16}
              //         >
              //           Sub Category: {task.SubCategory || "N/A"}
              //         </Typography>
              //       )}

              //       <Box display="flex" justifyContent="space-between" mt={1}>
              //         <Typography
              //           variant="body2"
              //           color="text.secondary"
              //           fontWeight={600}
              //           fontSize={16}
              //         >
              //           Posted in:{" "}
              //           {new Date(task.createdAt).toLocaleDateString()}
              //         </Typography>

              //         <Chip
              //           label={`₹${task.amount}`}
              //           sx={{
              //             bgcolor: colors[index % colors.length],
              //             color: "white",
              //             fontSize: 16,
              //             padding: "10px",
              //           }}
              //         />
              //       </Box>
              //     </CardContent>
              //   </Card>
              // </Grid>

              <Grid item xs={12} sm={6} md={4} key={index}>
                {(() => {
                  const alreadyBidded = bids.some(
                    (bid) => Number(bid.taskId) === Number(task.taskId)
                  );

                  const isOwner =
                    Number(task.userId || task.taskUserId) ===
                    Number(userInfo?.userId);

                  return (
                    <Card
                      // onClick={() =>
                      //   setSelectedTask({ ...task, alreadyBidded })
                      // }
                      onClick={() => handleTaskClick(task, alreadyBidded)}
                      sx={{
                        borderRadius: 2,
                        border: "1px solid #e0e0e0",
                        cursor: "pointer",
                        boxShadow: 3,
                        transition: "0.3s",
                        "&:hover": {
                          boxShadow: 6,
                          transform: "scale(1.02)",
                        },
                      }}
                    >
                      <CardContent>
                        {/* Task Description */}
                        <Box textAlign="center" mb={1}>
                          <Typography fontSize={16} fontWeight={600} noWrap>
                            {task.description || "Task Description"}
                          </Typography>
                        </Box>

                        <Divider />

                        {/* Row 1: Task ID + Status */}
                        <Box
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                          mt={1}
                        >
                          <Typography fontSize={14} fontWeight={600}>
                            Task ID: {task.taskId}
                          </Typography>

                          <Chip
                            icon={
                              alreadyBidded ? (
                                <Star fontSize="small" />
                              ) : isOwner ? (
                                <Person fontSize="small" />
                              ) : (
                                <AccessTime fontSize="small" />
                              )
                            }
                            label={
                              alreadyBidded
                                ? "My Bid"
                                : isOwner
                                ? "My Task"
                                : task.status === "verified"
                                ? "Open"
                                : task.status
                            }
                            sx={{
                              bgcolor: alreadyBidded
                                ? "#1E88E5"
                                : isOwner
                                ? "#6A1B9A"
                                : "#43a047",
                              color: "#fff",
                              fontWeight: 600,
                            }}
                          />
                        </Box>

                        {/* Category */}
                        {/* <Box mt={1}>
                          <Typography fontSize={15} fontWeight={700}>
                            Category: {task.Categories}
                          </Typography>
                        </Box> */}

                        <Box
                          mt={0.5}
                          display="flex"
                          alignItems="center"
                          gap={1}
                        >
                          <CategoryIcon
                            fontSize="small"
                            sx={{ color: "#43a047" }}
                          />
                          <Typography fontSize={15} fontWeight={700}>
                            Category: {task.Categories}
                          </Typography>
                        </Box>

                        {/* Subcategory */}
                        <Box
                          mt={0.5}
                          display="flex"
                          alignItems="center"
                          gap={1}
                        >
                          <SubdirectoryArrowRightIcon
                            fontSize="small"
                            sx={{ color: "#ff1500ff" }}
                          />
                          <Typography fontSize={14} color="text.secondary">
                            Subcategory: {task.SubCategory || "N/A"}
                          </Typography>
                        </Box>

                        {/* Budget */}
                        <Box
                          mt={1.5}
                          mb={0}
                          display="flex"
                          justifyContent="center"
                        >
                          {/* <Box
                            px={2}
                            py={0.8}
                            borderRadius={1}
                            border="1px solid #2e7d32"
                          > */}
                          <Typography
                            fontWeight="bold"
                            color="#2e7d32"
                            fontSize={16}
                          >
                            Budget: ₹ {task.amount}
                          </Typography>
                          {/* </Box> */}
                        </Box>
                      </CardContent>
                    </Card>
                  );
                })()}
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Typography variant="h6" textAlign="center">
                Data Not Available
              </Typography>
            </Grid>
          )}
        </Grid>
      </Box>

      <Footer />
    </div>
  );
}

export default HomepageComponent;
