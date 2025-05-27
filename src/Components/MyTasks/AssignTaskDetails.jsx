import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Card,
  Typography,
  Grid,
  Button,
  Paper,
  IconButton,
  Avatar,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  TextField,
  Modal,
  Stack,
} from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import DescriptionIcon from "@mui/icons-material/Description";
import ImageIcon from "@mui/icons-material/Image";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import WorkIcon from "@mui/icons-material/Work";
import StarIcon from "@mui/icons-material/Star";
import ChartBoard from "../../Components/ChatBoard/chatBoardAssignTask";

// Reusable Document Card
const DocumentCard = ({ icon, label, fileUrl }) => (
  <Paper
    elevation={3}
    sx={{
      display: "flex",
      alignItems: "center",
      gap: 2,
      p: 2,
      borderRadius: 3,
      transition: "transform 0.3s, box-shadow 0.3s",
      "&:hover": {
        transform: "scale(1.03)",
        boxShadow: 6,
      },
      cursor: "pointer",
      minWidth: 250,
    }}
    onClick={() => window.open(fileUrl, "_blank")}
  >
    <IconButton color="primary" sx={{ fontSize: 40 }}>
      {icon}
    </IconButton>
    <Typography variant="h6" fontWeight="bold">
      {label}
    </Typography>
  </Paper>
);

// Document Section
const DocumentSection = ({ title, documents = [] }) => {
  const getIcon = (filename) => {
    const ext = filename.split(".").pop().toLowerCase();
    if (ext === "pdf") return <PictureAsPdfIcon fontSize="inherit" />;
    if (["jpg", "jpeg", "png", "gif", "bmp"].includes(ext))
      return <ImageIcon fontSize="inherit" />;
    return <DescriptionIcon fontSize="inherit" />;
  };

  const baseUrl = "http://localhost:3001/storege/userdp/";

  return (
    <Box mb={5}>
      <Typography variant="h5" fontWeight="bold" color="primary" mb={2}>
        {title}
      </Typography>
      <Grid container spacing={3}>
        {documents.length > 0 ? (
          documents.map((file, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <DocumentCard
                icon={getIcon(file)}
                label={file}
                fileUrl={`${baseUrl}${file}`}
              />
            </Grid>
          ))
        ) : (
          <Typography variant="body1" color="text.secondary" ml={2}>
            No documents available.
          </Typography>
        )}
      </Grid>
    </Box>
  );
};

// Custom SkillCard component
const SkillCard = ({ skill, experience }) => (
  <Card
    elevation={3}
    sx={{
      p: 2,
      borderRadius: 2,
      textAlign: "center",
      backgroundColor: "#fff7e6",
    }}
  >
    <Typography variant="subtitle1" fontWeight="bold">
      {skill}
    </Typography>
    <Typography variant="body2" color="text.secondary">
      {experience}
    </Typography>
  </Card>
);

const ExciteProfileCard = ({ bidder }) => {
  if (!bidder) return null;

  return (
    <Card
      elevation={6}
      sx={{
        p: 4,
        borderRadius: 4,
        background: "linear-gradient(to right, #ffffff, #f9f9f9)",
        boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
        maxWidth: 2000,
        margin: "auto",
      }}
    >
      <Box display="flex" alignItems="center" mb={4}>
        <Avatar
          alt={bidder?.userName}
          src={
            bidder?.profilePic
              ? `http://localhost:3001/storege/userdp/${bidder.profilePic}`
              : ""
          }
          sx={{ width: 70, height: 70, mr: 3, border: "2px solid orange" }}
        />
        <Box>
          <Typography variant="h6" fontWeight="bold">
            {bidder.userName || "N/A"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Experience: {bidder.experiance || "N/A"} Yrs
          </Typography>
        </Box>
      </Box>

      <Box mt={4} mb={2}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Skills & Experience
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {Array.isArray(bidder.skills) && bidder.skills.length > 0 ? (
          bidder.skills.map((skillItem, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                elevation={3}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  height: "100%",
                  width: "70%",
                  mb: "2",
                }}
              >
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Skill: {skillItem.work || "N/A"}
                </Typography>

                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Experience: {skillItem.experience || "0 Years"}
                </Typography>
              </Card>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Typography variant="body2" color="text.secondary" sx={{ px: 2 }}>
              No skills available
            </Typography>
          </Grid>
        )}
      </Grid>
    </Card>
  );
};

// Main Component
const BidderDisputeCard = ({ task }) => {
  const [bidders, setBidders] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState("");
  const [description, setDescription] = useState("");

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const taskId = task.taskId;

  console.log("bbbbbbbbbbbb>", taskId);
  const handleDisputeSubmit = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await axios.put(
        "http://localhost:3001/task/update-status",
        {
          taskId: taskId, // this goes in the body
          status: status,
          description: description,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // this goes in the config object
          },
        }
      );

      console.log("Update Success:", response.data);
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);
    }

    handleClose();
  };

  useEffect(() => {
    const fetchBidders = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/Bids/users-by-task/${task.taskId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        console.log("====Ayaan====>", response.data);
        setBidders(response.data.data || []);
      } catch (error) {
        console.error("Error fetching bidders:", error);
        setBidders([]);
      } finally {
        setLoading(false);
      }
    };

    if (task?.taskId) {
      fetchBidders();
    }
  }, [task?.taskId, token]);

  return (
    <Box p={2} mt={10}>
      {/* Trigger Button */}
      <Box display="flex" justifyContent="flex-end" mt={2}>
        <Box
          display="flex"
          alignItems="center"
          gap={1}
          px={2}
          py={1}
          mb={3}
          borderRadius={2}
          onClick={handleOpen}
          sx={{
            cursor: "pointer",
            backgroundColor: "primary.main",
            color: "#ffffff",
            border: "1px solid",
            borderColor: "primary.dark",
            transition: "background 0.3s",
            "&:hover": {
              backgroundColor: "primary.dark",
            },
          }}
        >
          <Typography variant="h6" fontWeight="bold" color="inherit">
            Raise Dispute
          </Typography>
          <ArrowForwardIosIcon sx={{ color: "inherit" }} />
        </Box>
      </Box>

      {/* Modal */}
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            borderRadius: 2,
            p: 4,
            mb: 5,
          }}
        >
          <Typography variant="h6" mb={2}>
            Raise a Dispute
          </Typography>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={status}
              label="Status"
              onChange={(e) => setStatus(e.target.value)}
            >
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="verified">Verified</MenuItem>
              <MenuItem value="running">Running</MenuItem>
              <MenuItem value="dispute">Dispute</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
              <MenuItem value="rejected">Rejected</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            multiline
            minRows={3}
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            sx={{ mb: 3 }}
          />

          <Stack direction="row" justifyContent="space-between">
            <Button
              variant="contained"
              color="primary"
              onClick={handleDisputeSubmit}
            >
              Submit Dispute
            </Button>
            <Button variant="outlined" color="secondary" onClick={handleClose}>
              Close
            </Button>
          </Stack>
        </Box>
      </Modal>

      <Grid item xs={12}>
        <Box display="flex" gap={2}>
          <Card sx={{ p: 2, width: "50%", border: "1px solid #ccc" }}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="h6" fontWeight="bold">
                Category: {task.Categories}
              </Typography>
              <Typography
                variant="body2"
                color="textSecondary"
                fontWeight="bold"
              >
                {task.daysLeft}
              </Typography>
            </Box>

            <Box display="flex" justifyContent="space-between" mt={1}>
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

              <Typography fontSize="1.1rem" fontWeight="bold">
                Status : {task.status}
              </Typography>
            </Box>

            <Box display="flex" justifyContent="space-between" mt={1}>
              <Typography fontSize="1.1rem" fontWeight="bold">
                Posted in: {new Date(task.createdAt).toLocaleDateString()}
              </Typography>
            </Box>

            <Box display="flex" justifyContent="flex-end" mt={2}>
              <Button
                variant="contained"
                color="primary"
                sx={{
                  fontWeight: "bold",
                  fontSize: "1.3rem",
                  px: 3,
                  borderRadius: 8,
                }}
              >
                {task.amount}
              </Button>
            </Box>
          </Card>

          <Card sx={{ p: 2, width: "50%", border: "1px solid #ccc" }}>
            <Typography variant="h6" fontWeight="bold">
              Description :
            </Typography>
            <Typography mt={1} fontSize="1.1rem">
              {task.description}
            </Typography>
          </Card>
        </Box>
      </Grid>

      <Box mt={15}>
        <DocumentSection
          title="Task Owner Document"
          documents={task.document || []}
        />
        <DocumentSection
          title="Bidder Document"
          documents={task.document || []}
        />
      </Box>

      <Box mt={10}>
        {/* Show first bidder for now */}
        <ExciteProfileCard bidder={bidders[0]} />
      </Box>

      <Box mt={10}>
        <ChartBoard task={task} />
      </Box>
    </Box>
  );
};

export default BidderDisputeCard;
