import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Grid,
  Card,
  Typography,
  Button,
  Rating,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Modal,
  IconButton,
} from "@mui/material";
import { AttachFile, Image, PictureAsPdf, Close } from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";

const TaskDetails = () => {
  const location = useLocation();
  const task = location.state?.task;

  const [dialogOpen, setDialogOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [bidOfAmount, setbidOfAmount] = useState("");
  // const [dateOfBids, setdateOfBids] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [bidData, setBidData] = useState(null);
  const [totalTasks, setTotalTasks] = useState(0);
  const [disputeTasks, setDisputeTasks] = useState(0);
  const [completedTasks, setCompletedTasks] = useState(0);
  const [documents, setDocuments] = useState([]);
  const [users, setUsers] = useState([]);
  const [loginPopupOpen, setLoginPopupOpen] = useState(false);

  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.userId;

  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [fileName, setFileName] = useState("");
  const [fileType, setFileType] = useState("");

  const handlePreview = (docUrl) => {
    setSelectedDoc(docUrl);
    setPreviewOpen(true);
  };

  const handleClose = () => {
    setPreviewOpen(false);
    setSelectedDoc(null);
  };

  useEffect(() => {
    const fetchAllUsers = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("Authorization token missing!");
        return;
      }

      try {
        const response = await axios.get(
          "http://localhost:3001/user/all-user",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          setUsers(response.data.data); // assuming the users are in `data`
          console.log("==========>", users);
        } else {
          console.error("Failed to fetch users");
        }
      } catch (error) {
        console.error(
          "Error fetching users:",
          error.response?.data || error.message
        );
      }
    };

    fetchAllUsers();
  }, []);

  useEffect(() => {
    if (Array.isArray(task?.document)) {
      setDocuments(task.document);
    }
  }, [task?.document]);

  // const handleClickOpen = () => setDialogOpen(true);

  const handleClickOpen = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    // Open login popup
    setLoginPopupOpen(true);
  } else {
    setDialogOpen(true);
  }
};


  // const handleClickOpen = () => {
  //   const token = localStorage.getItem("token");
  //   if (!token) {
  //     // Redirect to login page
  //     navigate("/login", { state: { from: location.pathname } });
  //   } else {
  //     setDialogOpen(true);
  //   }
  // };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setbidOfAmount("");
    // setdateOfBids("");
    setDescription("");
    setFile(null);
  };

  const handleModalClose = () => setModalOpen(false);

  const handleAddBid = async () => {
    const token = localStorage.getItem("token");
    const userData = JSON.parse(localStorage.getItem("user"));

    if (!token || !userData?.userId) {
      alert("Authorization token or user data missing!");
      return;
    }

    // Find the current logged-in user's full record from fetched users
    const currentUser = users.find((user) => user.userId === userData.userId);

    if (!currentUser || currentUser.status !== "Approved") {
      alert("KYC Pending: Not permitted to add Bids");
      return;
    }
    if (!bidOfAmount || !description) {
      alert("Amount and description are required.");
      return;
    }

    const formData = new FormData();
    formData.append("bidOfAmount", bidOfAmount);
    formData.append("description", description);
    // formData.append("dateOfBids", dateOfBids);
    formData.append("Categories", task?.Categories || "");
    formData.append("SubCategory", task?.SubCategory || "");
    formData.append("amount", task?.amount || "");
    formData.append("targetedPostIn", task?.targetedPostIn || "");
    formData.append("daysLeft", task?.daysLeft || "");
    formData.append("bidUserId", userId || "");
    formData.append("taskUserId", task?.taskUserId || "");
    formData.append("userId", userId || "");
    formData.append("taskId", task?.taskId || "");
    formData.append("taskDescription", task?.description || "");

    // Append taskDocument as array of filenames (not files)
    if (Array.isArray(task?.document)) {
      task.document.forEach((doc) => {
        formData.append("taskDocument[]", doc);
      });
    }

    if (file) {
      file.forEach((f) => {
        formData.append("biderDocument", f);
      });
    }

    try {
      const response = await axios.post(
        "http://localhost:3001/Bids/create",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const bidId = response.data?.data?.BidId;
      const getResponse = await axios.get(
        `http://localhost:3001/Bids/get-by-bidid?bidId=${bidId}`
      );

      setBidData(getResponse.data?.data || getResponse.data);
      setDialogOpen(false);
      setModalOpen(true);
    } catch (error) {
      console.error("Error submitting or retrieving bid:", error);
      alert("Failed to submit bid. Please try again.");
    }
  };

  useEffect(() => {
    const fetchTaskStats = async () => {
      try {
        const userId = task?.userId;
        const token = localStorage.getItem("token");
        if (!userId || !token) return;

        const res = await axios.get(
          `http://localhost:3001/task/task-summary-by-user?userId=${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const { totalTasks, disputeTasks, completedTasks } =
          res.data?.data || {};
        setTotalTasks(totalTasks || 0);
        setDisputeTasks(disputeTasks || 0);
        setCompletedTasks(completedTasks || 0);
      } catch (error) {
        console.error("Error fetching task stats:", error);
      }
    };

    fetchTaskStats();
  }, [task?.userId]);

  return (
    <Box p={{ xs: 2, md: 4 }} mt={{ xs: 2, md: 3 }}>
      <Button
        variant="outlined"
        color="secondary"
        // onClick={() => props.onBack()}
        onClick={() => navigate(-1)}
        sx={{ mb: 2, fontSize: { xs: "0.9rem", md: "1rem" } }}
      >
        ← Back
      </Button>

      <Grid container spacing={3} alignItems="stretch">
        {/* Category Card */}
        <Grid item xs={12} md={6}>
          <Box display="flex" height="100%">
            <Card
              sx={{
                p: { xs: 2, md: 3 },
                border: "1px solid #ccc",
                width: "100%",
              }}
            >
              {/* Top: Category and Days Left */}
              <Box
                display="flex"
                justifyContent="space-between"
                flexWrap="wrap"
                gap={1}
              >
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  fontSize={{ xs: "1rem", md: "1.25rem" }}
                >
                  Category: {task?.Categories}
                </Typography>
                <Typography
                  variant="subtitle2"
                  color="textSecondary"
                  fontSize={{ xs: "0.9rem", md: "1rem" }}
                >
                  {task?.daysLeft}
                </Typography>
              </Box>

              {/* Middle: SubCategory or From-To and Status */}
              <Box
                mt={2}
                display="flex"
                justifyContent="space-between"
                flexWrap="wrap"
                gap={1}
              >
                {task?.Categories === "Transport" ? (
                  <Box
                    display="flex"
                    flexDirection={{ xs: "column", sm: "row" }}
                    gap={2}
                  >
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      fontWeight={600}
                      fontSize={{ xs: 14, sm: 16 }}
                    >
                      From: {task?.from || "N/A"}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      fontWeight={600}
                      fontSize={{ xs: 14, sm: 16 }}
                    >
                      To: {task?.to || "N/A"}
                    </Typography>
                  </Box>
                ) : (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    fontWeight={600}
                    fontSize={{ xs: 14, sm: 16 }}
                  >
                    Sub Category: {task?.SubCategory || "N/A"}
                  </Typography>
                )}

                <Typography
                  variant="body2"
                  fontWeight="bold"
                  fontSize={{ xs: "0.95rem", md: "1rem" }}
                >
                  Status: {task?.status === 'verified' ? 'Open' : task.status}
                </Typography>
              </Box>

              {/* Bottom: Posted in and Amount */}
              <Box
                mt={2}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                flexWrap="wrap"
                gap={2}
              >
                <Typography
                  variant="body2"
                  fontWeight="bold"
                  fontSize={{ xs: "0.95rem", md: "1rem" }}
                >
                  Posted in: {new Date(task?.createdAt).toLocaleDateString()}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  size="medium"
                  sx={{ fontSize: { xs: "0.9rem", md: "1rem" }, px: 2, py: 1 }}
                >
                  ₹ {task?.amount}
                </Button>
              </Box>
            </Card>
          </Box>
        </Grid>

        {/* Description Card */}
        <Grid item xs={12} md={6}>
          <Box display="flex" height="100%">
            <Card
              sx={{
                p: { xs: 2, md: 3 },
                border: "1px solid #ccc",
                width: "100%",
                // height: "100%",
              }}
            >
              <Typography
                variant="h6"
                fontWeight="bold"
                fontSize={{ xs: "1rem", md: "1.25rem" }}
              >
                Description:
              </Typography>
              <Typography
                variant="body2"
                mt={2}
                fontSize={{ xs: "0.95rem", md: "1rem" }}
              >
                {task?.description}
              </Typography>
            </Card>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Typography
            variant="h6"
            mb={2}
            fontWeight="bold"
            fontSize={{ xs: "1.1rem", md: "1.4rem" }}
          >
            Task Owner Details
          </Typography>
          <Card
            sx={{
              p: { xs: 2, md: 3 },
              border: "2px solid #ccc",
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={6} sm={3} textAlign="center">
                <Typography
                  fontWeight="bold"
                  fontSize={{ xs: "0.9rem", md: "1rem" }}
                >
                  Total Tasks
                </Typography>
                <Typography fontSize={{ xs: "0.85rem", md: "0.95rem" }}>
                  {totalTasks}
                </Typography>
              </Grid>
              <Grid item xs={6} sm={3} textAlign="center">
                <Typography
                  fontWeight="bold"
                  fontSize={{ xs: "0.9rem", md: "1rem" }}
                >
                  Dispute Tasks
                </Typography>
                <Typography fontSize={{ xs: "0.85rem", md: "0.95rem" }}>
                  {disputeTasks}
                </Typography>
              </Grid>
              <Grid item xs={6} sm={3} textAlign="center">
                <Typography
                  fontWeight="bold"
                  fontSize={{ xs: "0.9rem", md: "1rem" }}
                >
                  Completed Tasks
                </Typography>
                <Typography fontSize={{ xs: "0.85rem", md: "0.95rem" }}>
                  {completedTasks}
                </Typography>
              </Grid>
              <Grid item xs={6} sm={3} textAlign="center">
                <Typography
                  fontWeight="bold"
                  fontSize={{ xs: "0.9rem", md: "1rem" }}
                >
                  Points
                </Typography>
                <Typography fontSize={{ xs: "0.85rem", md: "0.95rem" }}>
                  350
                </Typography>
                <Rating value={4} readOnly precision={0.5} size="small" />
              </Grid>
            </Grid>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Typography
            variant="h6"
            mb={2}
            fontWeight="bold"
            fontSize={{ xs: "1.1rem", md: "1.4rem" }}
          >
            Documents
          </Typography>

          <Card sx={{ p: { xs: 2, md: 3 }, border: "2px solid #ccc" }}>
            <Grid container spacing={2}>
              {documents.length > 0 ? (
                documents.map((docFileName, index) => {
                  const docUrl = `http://localhost:3001/storege/userdp/${docFileName}`;
                  const name = docFileName;
                  const ext = name.split(".").pop().toLowerCase();

                  let IconComponent = AttachFile;
                  if (["jpg", "jpeg", "png", "gif", "bmp"].includes(ext)) {
                    IconComponent = Image;
                  } else if (ext === "pdf") {
                    IconComponent = PictureAsPdf;
                  }

                  return (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <Box display="flex" alignItems="center" flexWrap="wrap">
                        <IconButton
                          onClick={() => {
                            setSelectedDoc(docUrl);
                            setFileName(name);
                            setFileType(ext === "pdf" ? "pdf" : "image");
                            setPreviewOpen(true);
                          }}
                          sx={{ color: "#333" }}
                        >
                          <IconComponent fontSize="large" />
                        </IconButton>
                        <Typography
                          ml={1}
                          fontSize={{ xs: "0.9rem", md: "1rem" }}
                          wordBreak="break-word"
                        >
                          {name}
                        </Typography>
                      </Box>
                    </Grid>
                  );
                })
              ) : (
                <Grid item xs={12}>
                  <Typography fontSize={{ xs: "0.9rem", md: "1rem" }}>
                    No documents found.
                  </Typography>
                </Grid>
              )}
            </Grid>
          </Card>

          {/* Modal Preview */}
          <Modal open={previewOpen} onClose={handleClose}>
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                bgcolor: "white",
                p: { xs: 2, md: 3 },
                borderRadius: 2,
                maxWidth: "90vw",
                maxHeight: "90vh",
                width: { xs: "90%", md: "70%" },
                overflow: "auto",
              }}
            >
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={2}
              >
                <Typography variant="subtitle1" fontWeight="bold">
                  {fileName}
                </Typography>
                <IconButton onClick={handleClose}>
                  <Close />
                </IconButton>
              </Box>

              {fileType === "pdf" ? (
                <iframe
                  src={selectedDoc}
                  title="PDF Preview"
                  style={{ width: "100%", height: "70vh", border: "none" }}
                />
              ) : (
                <img
                  src={selectedDoc}
                  alt="Preview"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "70vh",
                    display: "block",
                    margin: "0 auto",
                  }}
                />
              )}

              <Box mt={2} textAlign="right">
                <Button
                  variant="contained"
                  color="primary"
                  href={selectedDoc}
                  download={fileName}
                  sx={{ fontSize: { xs: "0.85rem", md: "1rem" }, px: 3 }}
                >
                  Download
                </Button>
              </Box>
            </Box>
          </Modal>
        </Grid>

        <Grid item xs={12}>
          <Box
            display="flex"
            justifyContent="center"
            textAlign="center"
            mt={{ xs: 2, md: 4 }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={handleClickOpen}
              sx={{
                fontSize: { xs: "1rem", sm: "1.1rem", md: "1.3rem" },
                px: { xs: 3, md: 4 },
                py: { xs: 1, md: 1.2 },
                width: { xs: "90%", sm: "auto" },
                maxWidth: "300px",
              }}
            >
              Add Bid
            </Button>
          </Box>
        </Grid>
      </Grid>

      {/* Add Bid Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        fullWidth
        maxWidth="sm" // keeps it compact and readable on larger screens
        PaperProps={{
          sx: {
            mx: { xs: 2, sm: 4 }, // margin on small screens
            my: { xs: 4, sm: 6 },
          },
        }}
      >
        <DialogTitle sx={{ fontSize: { xs: "1.2rem", sm: "1.5rem" } }}>
          Add Your Bid
        </DialogTitle>

        <DialogContent>
          <TextField
            label="Bid Amount"
            fullWidth
            value={bidOfAmount}
            onChange={(e) => setbidOfAmount(e.target.value)}
            margin="dense"
            sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}
          />

          {/* Optional: Bid Date */}
          {/* <TextField
      label="Bid Date"
      type="date"
      fullWidth
      value={dateOfBids}
      onChange={(e) => setdateOfBids(e.target.value)}
      margin="dense"
      InputLabelProps={{ shrink: true }}
    /> */}

          <TextField
            label="Description"
            fullWidth
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            margin="dense"
          />

          <Box mt={2}>
            <input
              type="file"
              multiple
              onChange={(e) => setFile(Array.from(e.target.files))}
              style={{
                width: "100%",
                fontSize: "0.9rem",
              }}
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button variant="contained" onClick={handleAddBid}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={loginPopupOpen}
        onClose={() => setLoginPopupOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Login Required</DialogTitle>
        <DialogContent>
          <Typography>
            You need to be logged in to add a bid. Please login first.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLoginPopupOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() =>
              navigate("/login", { state: { from: location.pathname } })
            }
          >
            Login
          </Button>
        </DialogActions>
      </Dialog>

      <Modal open={modalOpen} onClose={handleModalClose}>
        <Box
          sx={{
            width: { xs: "80%", sm: "80%", md: 600 }, // Responsive width
            maxHeight: "85vh",
            overflowY: "auto",
            bgcolor: "#fff",
            p: { xs: 2, sm: 3, md: 4 },
            borderRadius: 3,
            mx: "auto",
            mt: { xs: "10vh", sm: "8vh", md: "5vh" },
            // mx: { xs: 2, sm: "auto" },
            outline: "none",
            boxShadow: 24,
          }}
        >
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            mb={3}
            textAlign="center"
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/9456/9456124.png"
              alt="success"
              width={70}
              height={70}
              style={{ marginBottom: "10px" }}
            />
            <Typography variant="h6" fontWeight="bold" color="primary">
              Bidding Success
            </Typography>
          </Box>

          <Card sx={{ p: 2, mb: 2, backgroundColor: "#f7f7f7" }}>
            <Box
              display="flex"
              flexDirection={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
              alignItems={{ xs: "flex-start", sm: "center" }}
              gap={1}
            >
              <Typography>
                <b>Bid ID :</b> {bidData?.BidId}
              </Typography>
              <Typography color="primary">
                <b>Posted on :</b>{" "}
                {new Date(bidData?.createdAt).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </Typography>
            </Box>
            <Typography mt={1}>
              <b>Task ID :</b> {bidData?.taskId}
            </Typography>
            <Typography mt={1}>
              <b>Bid Description :</b> {bidData?.description}
            </Typography>
          </Card>

          <Card sx={{ p: 2, mb: 2, backgroundColor: "#f7f7f7" }}>
            <Typography>
              <b>Description :</b> {bidData?.taskDescription}
            </Typography>
          </Card>

          <Card sx={{ p: 2, mb: 3, backgroundColor: "#f7f7f7" }}>
            <Typography>
              <b>Budget :</b> ₹ {bidOfAmount}
            </Typography>
          </Card>

          <Box textAlign="center">
            <Button
              variant="contained"
              color="primary"
              onClick={handleModalClose}
              sx={{
                borderRadius: 5,
                px: { xs: 3, sm: 5 },
                py: 1.2,
                fontSize: { xs: "1rem", sm: "1.1rem" },
              }}
            >
              Close
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default TaskDetails;
