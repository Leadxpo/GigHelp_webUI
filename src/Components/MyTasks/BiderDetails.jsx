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
} from "@mui/material";
import ChartBoard from "../../Components/ChatBoard/ChatBoardmyTask";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const CandidateCard = ({ bidder }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.userId;

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

  const handleTransferPayment = async () => {
    if (!assignedName || !bidder || !bidder.bidDetails) {
      console.error("Missing required fields");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3001/transections/create",
        {
          name: assignedName,
          amount: bidder.bidDetails.bidOfAmount,
          taskOwner: userId,
          userId: userId,
          taskUser: bidder.bidDetails.userId,
          categoryName: bidder.bidDetails.Categories,
        }
      );

      console.log("Transfer Payment Response:", response);

      if (response.status === 200 || response.status === 201) {
        setOpenTransferModal(false);
        setOpenSuccessModal(true);
      }
    } catch (err) {
      console.error(
        "Transfer Payment Error:",
        err?.response?.data || err.message
      );
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

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        borderRadius: 3,
        maxWidth: "90%",
        margin: "auto",
        mt: 5,
      }}
    >
      {/* Header */}
      <Grid container alignItems="center" justifyContent="space-between">
        <Grid item display="flex" alignItems="center" gap={2}>
          <Avatar
            alt="Alexandra"
            src={
              bidder?.profilePic
                ? `http://localhost:3001/storege/userdp/${bidder?.profilePic}`
                : ""
            }
            sx={{ width: 64, height: 64, border: "2px solid orange" }}
          />
          <Box>
            <Typography variant="h6">{bidder?.userName}</Typography>
            <Typography variant="body2">
              Experience : {bidder?.experiance}
            </Typography>
          </Box>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            sx={{ borderRadius: 2 }}
            onClick={handleAssignOpen}
          >
            Approved Bids
          </Button>
        </Grid>
      </Grid>

      {/* Skills */}
      <Grid container spacing={2} mt={3}>
        {bidder?.skills?.map((skill, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Box sx={{ backgroundColor: "#eee", p: 2, borderRadius: 2 }}>
              <Grid container justifyContent="space-between">
                <Grid item xs={6}>
                  <Typography fontWeight={600}>
                    Skill : {skill.title}
                  </Typography>
                  <Box
                    sx={{
                      borderBottom: "2px solid black",
                      width: "90%",
                      mt: 1,
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography fontWeight={600}>
                    Experience : {skill.experience}
                  </Typography>
                  <Box
                    sx={{
                      borderBottom: "2px solid black",
                      width: "90%",
                      mt: 1,
                    }}
                  />
                </Grid>
              </Grid>

              {/* Optionally show additional info like work or content */}
              <Grid container mt={2}>
                <Grid item xs={12}>
                  <Typography fontWeight={600}>Work: {skill.work}</Typography>
                  <Typography>Description: {skill.content}</Typography>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        ))}
      </Grid>

      <Divider sx={{ my: 4 }} />

      {/* Chat Section */}
      <Box>
        <Typography variant="h6" mb={2}>
          Chat Board Bidere
        </Typography>
        <ChartBoard task={bidder} />
      </Box>

      <Box>
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpen}
          alignItems="center"
        >
          Money Transfor Request
        </Button>

        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Task Completion Details</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Description"
              type="text"
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
      </Box>

      {/* Modal 1: Assign */}
      <Modal open={openAssignModal} onClose={handleAssignClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
            textAlign: "center",
          }}
        >
          <Typography variant="h6" sx={{ mb: 2, color: "#2196f3" }}>
            Do You Confirm Assignment To:
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
        </Box>
      </Modal>

      <Modal open={openTransferModal} onClose={handleTransferClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 500,
            bgcolor: "background.paper",
            borderRadius: 4,
            boxShadow: 24,
            p: 4,
          }}
        >
          <Box
            sx={{
              width: "90%",
              backgroundColor: "#d3d3d3",
              borderRadius: 1,
              p: 2,
              textAlign: "center",
              mb: 3,
            }}
          >
            <b>Bider Amount :</b>
            <Typography>{bidder?.bidDetails.bidOfAmount}</Typography>
          </Box>

          <Typography sx={{ fontWeight: "bold", color: "#2196f3", mb: 2 }}>
            Note :
          </Typography>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 4,
            }}
          >
            <Box
              sx={{
                width: "40%",
                backgroundColor: "#d3d3d3",
                borderRadius: 1,
                p: 2,
                textAlign: "left",
              }}
            >
              <b>From :</b>
              <Typography>{bidder?.userName}</Typography>
            </Box>

            <Typography sx={{ fontSize: 30 }}>→</Typography>

            <Box
              sx={{
                width: "40%",
                backgroundColor: "#d3d3d3",
                borderRadius: 1,
                p: 2,
                textAlign: "left",
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

      {/* Modal 3: Success Confirmation */}
      <Modal open={openSuccessModal} onClose={handleSuccessClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
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
            onClick={handleSuccessClose}
          >
            Close
          </Button>
        </Box>
      </Modal>
    </Paper>
  );
};

export default CandidateCard;
