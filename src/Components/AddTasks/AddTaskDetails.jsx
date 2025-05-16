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
  IconButton
} from "@mui/material";
import { AttachFile, Image, PictureAsPdf,Close } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const TaskDetails = (props) => {
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
    if (Array.isArray(props.task?.document)) {
      setDocuments(props.task.document);
    }
  }, [props.task?.document]);

  const handleClickOpen = () => setDialogOpen(true);
  const handleDialogClose = () => {
    setDialogOpen(false);
    setbidOfAmount("");
    // setdateOfBids("");
    setDescription("");
    setFile(null);
  };

  const handleModalClose = () => setModalOpen(false);

  const handleAddBid = async () => {
    if (!bidOfAmount || !description) {
      alert("Amount and description are required.");
      return;
    }

    const formData = new FormData();
    formData.append("bidOfAmount", bidOfAmount);
    formData.append("description", description);
    // formData.append("dateOfBids", dateOfBids);
    formData.append("Categories", props.task?.Categories || "");
    formData.append("SubCategory", props.task?.SubCategory || "");
    formData.append("amount", props.task?.amount || "");
    formData.append("targetedPostIn", props.task?.targetedPostIn || "");
    formData.append("daysLeft", props.task?.daysLeft || "");
    formData.append("bidUserId", userId || "");
    formData.append("taskUserId", props.task?.taskUserId || "");
    formData.append("userId", userId || "");
    formData.append("taskId", props.task?.taskId || "");
    formData.append("taskDescription", props.task?.description || "");



 // Append taskDocument as array of filenames (not files)
if (Array.isArray(props.task?.document)) {
  props.task.document.forEach((doc) => {
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
        const userId = props.task?.userId;
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
  }, [props.task?.userId]);

  return (
    <Box p={{ xs: 2, md: 4 }} mt={10}>
      <Button
        variant="outlined"
        color="secondary"
        onClick={() => props.onBack()}
        sx={{ mb: 2, fontSize: { xs: "0.9rem", md: "1rem" } }}
      >
        ← Back
      </Button>

      <Grid container spacing={3} alignItems="stretch">
        {/* Category Card */}
        <Grid item xs={12} md={6}>
          <Box display="flex" height="100%">
            <Card sx={{ p: 2, border: "1px solid #ccc", width: "100%" }}>
              {/* Top: Category and Days Left */}
              <Box display="flex" justifyContent="space-between">
                <Typography variant="h5" fontWeight="bold">
                  Category: {props.task.Categories}
                </Typography>
                <Typography variant="subtitle2" color="textSecondary">
                  {props.task.daysLeft}
                </Typography>
              </Box>

              {/* Middle: SubCategory and Status on the same line */}
              <Box mt={2} display="flex" justifyContent="space-between">
               {props.task.Categories === "Transport" ? (
                  <Box mt={1} display="flex" gap={2}>
                   <Typography
                     variant="body2"
                     color="text.secondary"
                     fontWeight={600}
                     fontSize={16}
                   >
                     From: {props.task.from || "N/A"}
                   </Typography>
                   <Typography
                     variant="body2"
                     color="text.secondary"
                     fontWeight={600}
                     fontSize={16}
                   >
                     To: {props.task.to || "N/A"}
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
                   Sub Category: {props.task.SubCategory || "N/A"}
                 </Typography>
               )}
               
                <Typography variant="body1" fontWeight="bold">
                  Status: {props.task.status}
                </Typography>
              </Box>

              {/* Bottom: Posted in and Amount on same line */}
              <Box
                mt={2}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="body1" fontWeight="bold">
                  Posted in:{" "}
                  {new Date(props.task.createdAt).toLocaleDateString()}
                </Typography>
                <Button variant="contained" color="primary" size="large">
                  ₹ {props.task.amount}
                </Button>
              </Box>
            </Card>
          </Box>
        </Grid>

        {/* Description Card */}
        <Grid item xs={12} md={6}>
          <Box display="flex" height="100%">
            <Card sx={{ p: 2, border: "1px solid #ccc", width: "100%" }}>
              <Typography variant="h5" fontWeight="bold">
                Description:
              </Typography>
              <Typography variant="body1" mt={2}>
                {props.task.description}
              </Typography>
            </Card>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h5" mb={2} fontWeight="bold">
            Task Owner Details
          </Typography>
          <Card sx={{ p: 3, border: "2px solid #ccc" }}>
            <Grid container spacing={2}>
              <Grid item xs={6} sm={3} textAlign="center">
                <Typography fontWeight="bold">Total Tasks</Typography>
                <Typography>{totalTasks}</Typography>
              </Grid>
              <Grid item xs={6} sm={3} textAlign="center">
                <Typography fontWeight="bold">Dispute Tasks</Typography>
                <Typography>{disputeTasks}</Typography>
              </Grid>
              <Grid item xs={6} sm={3} textAlign="center">
                <Typography fontWeight="bold">Completed Tasks</Typography>
                <Typography>{completedTasks}</Typography>
              </Grid>
              <Grid item xs={6} sm={3} textAlign="center">
                <Typography fontWeight="bold">Points</Typography>
                <Typography>350</Typography>
                <Rating value={4} readOnly precision={0.5} />
              </Grid>
            </Grid>
          </Card>
        </Grid>



       <Grid item xs={12}>
  <Typography variant="h5" mb={2} fontWeight="bold">
    Documents
  </Typography>
  <Card sx={{ p: 3, border: "2px solid #ccc" }}>
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
              <Box display="flex" alignItems="center">
                <IconButton
                  onClick={() => {
                    setSelectedDoc(docUrl);
                    setFileName(name);
                    setFileType(ext === "pdf" ? "pdf" : "image");
                    setPreviewOpen(true);
                  }}
                  style={{ color: "#333" }}
                >
                  <IconComponent fontSize="large" />
                </IconButton>
                <Typography ml={1}>{name}</Typography>
              </Box>
            </Grid>
          );
        })
      ) : (
        <Grid item xs={12}>
          <Typography>No documents found.</Typography>
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
        p: 3,
        borderRadius: 2,
        maxWidth: "90%",
        maxHeight: "90%",
        overflow: "auto",
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">{fileName}</Typography>
        <IconButton onClick={handleClose}>
          <Close />
        </IconButton>
      </Box>

      {fileType === "pdf" ? (
        <iframe
          src={selectedDoc}
          title="PDF Preview"
          style={{ width: "100%", height: "70vh" }}
        />
      ) : (
        <img
          src={selectedDoc}
          alt="Preview"
          style={{ maxWidth: "100%", maxHeight: "70vh" }}
        />
      )}

      <Box mt={2} textAlign="right">
        <Button variant="contained" color="primary" href={selectedDoc} download={fileName}>
          Download
        </Button>
      </Box>
    </Box>
  </Modal>
</Grid>



        <Grid item xs={12} textAlign="center">
          <Button
            variant="contained"
            color="primary"
            onClick={handleClickOpen}
            sx={{ fontSize: { xs: "1rem", md: "1.3rem" }, px: 4, py: 1 }}
          >
            Add Bid
          </Button>
        </Grid>
      </Grid>

      {/* Add Bid Dialog */}
      <Dialog open={dialogOpen} onClose={handleDialogClose} fullWidth>
        <DialogTitle>Add Your Bid</DialogTitle>
        <DialogContent>
          <TextField
            label="Bid Amount"
            fullWidth
            value={bidOfAmount}
            onChange={(e) => setbidOfAmount(e.target.value)}
            margin="dense"
          />
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
         <input
  type="file"
  multiple
  onChange={(e) => setFile(Array.from(e.target.files))}
  style={{ marginTop: "2rem" }}
/>

        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button variant="contained" onClick={handleAddBid}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      <Modal open={modalOpen} onClose={handleModalClose}>
  <Box
    sx={{
      width: 600,
      maxHeight: '80vh', // Limit height to 90% of viewport
      overflow: 'auto',   // Scroll when content exceeds max height
      bgcolor: "#fff",
      p: 4,
      borderRadius: 4,
      mx: "auto",
      mt: "5%",
      outline: "none",
      boxShadow: 24,
    }}
  >
    <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
      <img
        src="https://cdn-icons-png.flaticon.com/512/9456/9456124.png"
        alt="success"
        width={80}
        height={80}
        style={{ marginBottom: "10px" }}
      />
      <Typography variant="h5" fontWeight="bold" color="primary">
        Bidding Success
      </Typography>
    </Box>

    <Card sx={{ p: 2, mb: 2, backgroundColor: "#f7f7f7" }}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
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
        <b>Budget :</b> {bidOfAmount}
      </Typography>
    </Card>

    <Box textAlign="center">
      <Button
        variant="contained"
        color="primary"
        onClick={handleModalClose}
        sx={{ borderRadius: 5, px: 5, py: 1.2, fontSize: "1.1rem" }}
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
