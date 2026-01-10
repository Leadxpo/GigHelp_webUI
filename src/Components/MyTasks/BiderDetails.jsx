import React, { useState } from "react";
import axios from "axios";
import {
  Avatar,
  Box,
  Button,
  Grid,
  Paper,
  TextField,
  Typography,
  Divider,
  Modal,
  DialogTitle,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
} from "@mui/material";
import ChartBoard from "../../Components/ChatBoard/ChatBoardmyTask";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ProfileCard from "../ProfileCard/ProfileCard";
import { useLocation, useNavigate } from "react-router-dom";
import ApiService from "../../services/ApiServices";

const CandidateCard = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.userId;

  const location = useLocation();
  const navigate = useNavigate();
  const bidder = location.state?.bidder;
  const task = location.state?.task;
  console.log("Bidder Details:", bidder);

  const [assignedName, setAssignedName] = useState("");
  const [amount, setAmount] = useState("");

  const [openAssignModal, setOpenAssignModal] = useState(false);
  const [openTransferModal, setOpenTransferModal] = useState(false);
  const [openSuccessModal, setOpenSuccessModal] = useState(false);

  const handleAssignOpen = () => setOpenAssignModal(true);
  const handleAssignClose = () => setOpenAssignModal(false);

  const handleTransferOpen = () => {
    handleAssignClose();
    setOpenTransferModal(true);
  };
  const handleTransferClose = () => setOpenTransferModal(false);
  const handleSuccessClose = () => setOpenSuccessModal(false);

  // const handleTransferPayment = async () => {
  //   if (!assignedName || !bidder || !bidder.bidDetails) {
  //     console.error("Missing required fields");
  //     return;
  //   }

  //   try {
  //     const response = await axios.post(
  //       "http://localhost:3001/transections/create",
  //       {
  //         name: assignedName,
  //         amount: bidder.bidDetails.bidOfAmount,
  //         taskOwner: userId,
  //         userId: userId,
  //         taskUser: bidder.bidDetails.userId,
  //         categoryName: bidder.bidDetails.Categories,
  //       }
  //     );

  //     console.log("Transfer Payment Response:", response);

  //     if (response.status === 200 || response.status === 201) {
  //       setOpenTransferModal(false);
  //       setOpenSuccessModal(true);
  //     }
  //   } catch (err) {
  //     console.error(
  //       "Transfer Payment Error:",
  //       err?.response?.data || err.message
  //     );
  //   }
  // };

  const handleTransferPayment = async () => {
    if (!bidder || !bidder.bidDetails) return;

    try {
      // 1. Create transaction
      const payload = {
        userId: Number(userId), // the task owner who is paying
        bidId: bidder.bidDetails.BidId || null, // related bid
        taskId: Number(bidder.bidDetails.taskId),
        amount: Number(bidder.bidDetails.bidOfAmount),
        typeOfPayment: "debit", // since task owner is paying
        payerRole: "taskOwner",
        paymentMethod: "UPI", // optional
      };

      const response = await ApiService.post("transections/create", payload);

      if (response.success === true || response.status === 201) {
        // 2. Update task status
        await ApiService.patch("task/update-task", {
          taskId: Number(bidder.bidDetails.taskId),
          status: "assigned",
          assignedBidderId: bidder.bidDetails.bidUserId,
        });

        // 3. Update bid status
        await ApiService.patch(`Bids/update/${bidder.bidDetails.BidId}`, {
          status: "approved",
        });

        // 4. Close modal & show success
        setOpenTransferModal(false);
        setOpenSuccessModal(true);
      }
    } catch (err) {
      console.error("Transfer Error:", err.response?.data || err.message);
    }
  };

  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [Reqamount, setReqAmount] = useState("");

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setDescription("");
    setReqAmount("");
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");

    // const handleRequest = async () => {
    const formData = new FormData();
    formData.append("amount", Reqamount);
    formData.append("description", description);
    formData.append("taskId", bidder.taskId || "");
    formData.append("bidId", bidder.bidDetails?.BidId || "");
    formData.append("requestName", bidder.userName || "");
    formData.append("requestBy", bidder.bidDetails?.BidId || "");

    try {
      const response = await axios.post(
        "http://localhost:3001/request/create",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Request submitted:", response.data);
      handleClose();
    } catch (error) {
      console.error("Error submitting request:", error);
    }
  };

  const handleRedirection = () => {
    setOpenSuccessModal(false);
    // navigate('AssignTask', {task, bidder});
    navigate(`/mytasks/assigned-task/${bidder.bidDetails?.taskId}`, {
      state: {
        task,
        bidder,
      },
    });
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: { xs: 2, sm: 3 },
        borderRadius: 3,
        maxWidth: "95%",
        margin: "auto",
        // mt: { xs: 3, sm: 5 },
        mt: 12,
      }}
    >
      <Grid item xs={12} sm={4} textAlign={{ xs: "left", sm: "right" }}>
        <Button
          variant="contained"
          color="primary"
          sx={{
            borderRadius: 2,
            width: { xs: "100%", sm: "auto" },
            mt: { xs: 2, sm: 0 },
          }}
          onClick={handleAssignOpen}
        >
          Approve Bid
        </Button>
      </Grid>

      {bidder ? <ProfileCard bidder={bidder} /> : null}

      <Divider sx={{ my: 4 }} />

      {/* Chat Section */}
      <Box>
        <Typography variant="h6" mb={2}>
          Chat Board Bidder
        </Typography>
        <ChartBoard task={bidder} />
      </Box>

      {/* Money Transfer */}
      {/* <Box mt={3}>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleOpen}
        >
          Money Transfer Request
        </Button>

        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
          <DialogTitle>Task Completion Details</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Description"
              fullWidth
              variant="outlined"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Amount"
              type="number"
              fullWidth
              variant="outlined"
              value={Reqamount}
              onChange={(e) => setReqAmount(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="error">
              Close
            </Button>
            <Button onClick={handleSubmit} variant="contained" color="primary">
              Submit
            </Button>
          </DialogActions>
        </Dialog>
      </Box> */}

      {/* Modal 1: Assign */}
      <Modal open={openAssignModal} onClose={handleAssignClose}>
        {/* <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "80%", sm: 400 },
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
            textAlign: "center",
          }}
        >
          <Typography variant="h6" sx={{ mb: 2, color: "#2196f3" }}>
             Amount: ₹{bidder?.bidDetails?.bidOfAmount}
          </Typography>
          <TextField
            fullWidth
            placeholder="Enter Name"
            variant="filled"
            sx={{ backgroundColor: "#e0e0e0", mb: 3 }}
            value={assignedName}
            onChange={(e) => setAssignedName(e.target.value)}
          />
          <Button
            variant="contained"
            sx={{ width: 120, borderRadius: 5, fontWeight: "bold" }}
            onClick={handleTransferOpen}
          >
            OK
          </Button>
        </Box> */}
        <Box
          sx={{
            position: "fixed",
            inset: 0,
            bgcolor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1300,
          }}
        >
          <Box
            sx={{
              width: 330,
              bgcolor: "#fff",
              borderRadius: "25px",
              p: 3,
              textAlign: "center",
              position: "relative",
            }}
          >
            {/* Close Icon */}
            <IconButton
              onClick={() => setOpenAssignModal(false)}
              sx={{
                position: "absolute",
                top: 10,
                right: 10,
              }}
            >
              <CloseIcon />
            </IconButton>

            {/* Amount */}
            <Typography
              sx={{
                fontSize: 16,
                fontWeight: "bold",
                mb: 2,
              }}
            >
              Amount: ₹{bidder?.bidDetails?.bidOfAmount}
            </Typography>

            {/* Transfer Row */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 3,
              }}
            >
              <Typography sx={{ fontSize: 14, fontWeight: 500 }}>
                {/* From: {task?.user?.userName} */}
                From: {user?.userName}
              </Typography>

              <ArrowForwardIcon sx={{ mx: 1 }} />

              <Typography sx={{ fontSize: 14, fontWeight: 500 }}>
                To: Super Admin
              </Typography>
            </Box>

            {/* Transfer Button */}
            <Button
              onClick={handleTransferPayment}
              sx={{
                bgcolor: "#1DA1F2",
                color: "#fff",
                px: 4,
                py: 1.2,
                borderRadius: "25px",
                fontWeight: "bold",
                fontSize: 16,
                textTransform: "none",
                "&:hover": {
                  bgcolor: "#1784c7",
                },
              }}
            >
              Transfer Payment
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Modal 2: Transfer */}
      <Modal open={openTransferModal} onClose={handleTransferClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "80%", sm: 500 },
            bgcolor: "background.paper",
            borderRadius: 4,
            boxShadow: 24,
            p: 4,
          }}
        >
          <Box
            sx={{
              // width: "100%",
              backgroundColor: "#d3d3d3",
              borderRadius: 1,
              p: 3,
              textAlign: "center",
              mb: 3,
              marginLeft: "-15px",
              marginRight: "-15px",
              display: "flex",
            }}
          >
            <b>Bidder Amount :</b>
            <Typography>{bidder?.bidDetails.bidOfAmount}</Typography>
          </Box>

          <Typography sx={{ fontWeight: "bold", color: "#2196f3", mb: 2 }}>
            Note :
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "space-between",
              alignItems: "center",
              gap: 2,
              mb: 4,
            }}
          >
            <Box
              sx={{
                width: "100%",
                backgroundColor: "#d3d3d3",
                borderRadius: 1,
                p: 3,
                textAlign: "left",
                display: "flex",
              }}
            >
              <b>From :</b>
              <Typography>{bidder?.userName}</Typography>
            </Box>

            <Typography sx={{ fontSize: 30, alignSelf: "center" }}>
              →
            </Typography>

            <Box
              sx={{
                width: "100%",
                backgroundColor: "#d3d3d3",
                borderRadius: 1,
                p: 3,
                textAlign: "left",
                display: "flex",
              }}
            >
              <b>To :</b>
              <Typography>Super Admin</Typography>
            </Box>
          </Box>

          <Button
            fullWidth
            variant="contained"
            sx={{
              backgroundColor: "#2196f3",
              color: "#fff",
              fontWeight: "bold",
              borderRadius: 2,
              py: 1.5,
              "&:hover": { backgroundColor: "#1976d2" },
            }}
            onClick={handleTransferPayment}
          >
            Transfer Payment
          </Button>
        </Box>
      </Modal>

      {/* Modal 3: Success */}
      <Modal open={openSuccessModal} onClose={handleSuccessClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "80%", sm: 400 },
            bgcolor: "background.paper",
            borderRadius: 4,
            boxShadow: 24,
            p: 4,
            textAlign: "center",
          }}
        >
          <CheckCircleIcon sx={{ fontSize: 60, color: "green", mb: 2 }} />
          <Typography variant="h6" sx={{ mb: 1 }}>
            Payment Transferred Successfully!
          </Typography>
          <Button
            variant="contained"
            color="success"
            sx={{ mt: 2, borderRadius: 5 }}
            // onClick={handleSuccessClose}
            onClick={handleRedirection}
          >
            Close
          </Button>
        </Box>
      </Modal>
    </Paper>
  );
};

export default CandidateCard;
