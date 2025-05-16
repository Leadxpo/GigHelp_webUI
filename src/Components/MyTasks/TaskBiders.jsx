import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  IconButton,
  TextField,
  Grid,
  Avatar,
  Card,
  CardContent,
  Container,
  Button,
} from "@mui/material";
import Modal from "@mui/material/Modal";
import Close from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DescriptionIcon from "@mui/icons-material/Description";
import ImageIcon from "@mui/icons-material/Image";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import AttachFile from "@mui/icons-material/AttachFile";
import Image from "@mui/icons-material/Image";
import PictureAsPdf from "@mui/icons-material/PictureAsPdf";
import BidderDetails from "../../Components/MyTasks/BiderDetails";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// CategoryCard section
const CategoryCard = ({ task }) => {
  const [documents, setDocuments] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [fileName, setFileName] = useState("");
  const [fileType, setFileType] = useState("");
  const [editing, setEditing] = useState(false);
  const [amount, setAmount] = useState(task.Amount || "");

  const handleClose = () => {
    setPreviewOpen(false);
    setSelectedDoc(null);
    setFileName("");
    setFileType("");
  };

  const handleUpdateTask = async () => {
    const token = localStorage.getItem("token"); // Assuming token is stored in localStorage

    try {
      const response = await axios.put(
        `http://localhost:3001/task/update/${task.taskId}`,
        {
          amount: amount, // Only update fields needed
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // if you're using userAuth middleware
          },
        }
      );

      if (response.status === 200) {
        alert("Bidding amount updated successfully!");
        setEditing(false);
      } else {
        alert("Update failed.");
      }
    } catch (error) {
      console.error("Error updating bid:", error);
      alert("An error occurred while updating the bid.");
    }
  };

  useEffect(() => {
    if (Array.isArray(task?.document)) {
      setDocuments(task.document);
    }
  }, [task?.biderDocument, documents]);
  // Replace with actual documents prop if passed
  return (
    <Box sx={{ position: "relative", mt: 15 }}>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => task?.onBack()}
          sx={{ fontSize: "1rem", fontWeight: "bold" }}
        >
          ← Back
        </Button>

        {!editing ? (
          <Button
            variant="contained"
            color="primary"
            onClick={() => setEditing(true)}
            sx={{ fontSize: "1rem", fontWeight: "bold" }}
          >
            Edit
          </Button>
        ) : (
          <Button
            variant="contained"
            color="success"
            onClick={handleUpdateTask}
            sx={{ fontSize: "1rem", fontWeight: "bold" }}
          >
            Submit
          </Button>
        )}
      </Box>

      {/* Category and Description Section */}
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
              <Typography variant="body2" color="textSecondary">
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
              {editing ? (
                <TextField
                  type="number"
                  label="Enter New Amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  variant="outlined"
                  size="small"
                />
              ) : (
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
              )}
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

      {/* Bidder Documents (Add Reference Section) */}
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
                <Typography>No documents found</Typography>
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
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
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
              <Button
                variant="contained"
                color="primary"
                href={selectedDoc}
                download={fileName}
              >
                Download
              </Button>
            </Box>
          </Box>
        </Modal>
      </Grid>
    </Box>
  );
};

// BidderCard
const BidderCard = ({ name, date, amount, image, onClick }) => {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <Card
      onClick={onClick}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        p: 2,
        borderRadius: 3,
        boxShadow: 3,
        transition: "0.3s",
        cursor: "pointer",
        "&:hover": {
          boxShadow: 6,
        },
      }}
    >
      <Avatar
        src={image}
        sx={{
          width: 80,
          height: 80,
          fontSize: 28,
          bgcolor: image ? "transparent" : "orange",
          color: "#fff",
          border: "3px solid orange",
        }}
      >
        {!image && initials}
      </Avatar>
      <CardContent sx={{ p: 0 }}>
        <Typography variant="h6" fontWeight="bold">
          Name : {name}
        </Typography>
        <Typography variant="body2" color="text.secondary" mt={0.5}>
          Posted info My Bids : {date}
        </Typography>
        <Typography variant="body2" color="text.primary" mt={1}>
          Amount : {amount}/-
        </Typography>
      </CardContent>
    </Card>
  );
};

const SinglePage = ({ task }) => {
  const [selectedBidder, setSelectedBidder] = useState(null);
  const [bidders, setBidders] = useState([]);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token"); // Assuming token is stored in localStorage

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [biddersRes, bidsRes] = await Promise.all([
          axios.get(`http://localhost:3001/Bids/users-by-task/${task.taskId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }),
          axios.get("http://localhost:3001/Bids/get-all-bids", {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }),
        ]);

        const allBids = bidsRes.data.data || [];
        const filteredBids = allBids.filter((bid) => bid.taskId == task.taskId); // loosely match

        const rawBidders = biddersRes.data.data || [];

        console.log("rawBidders >", rawBidders);
        console.log("filteredBids >", filteredBids);

        const combined = rawBidders.map((bidder) => {
          const bidInfo = filteredBids.find(
            (bid) => bid.userId == bidder.userId
          ); // loose match here too
          return {
            ...bidder,
            bidDetails: bidInfo || null,
          };
        });

        setBids(filteredBids);
        setBidders(combined);
      } catch (error) {
        console.error("Error fetching data:", error);
        setBidders([]);
        setBids([]);
      } finally {
        setLoading(false);
      }
    };

    if (task?.taskId) {
      fetchData();
    }
  }, [task?.taskId, token]);

  console.log("biddereeeee>", bidders);

  return (
    <Container maxWidth="1100" sx={{ mt: 4, mb: 4 }}>
      {selectedBidder ? (
        <>
          <Button
            variant="outlined"
            onClick={() => setSelectedBidder(null)}
            sx={{ mb: 2, mt: 5 }}
          >
            Back to Bidders
          </Button>
          <BidderDetails bidder={selectedBidder} />
        </>
      ) : (
        <>
          <CategoryCard task={task} />
          <Box mt={10}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Bidders
            </Typography>
            {loading ? (
              <Typography>Loading bidders...</Typography>
            ) : bidders.length === 0 ? (
              <Typography>No bidders found for this task.</Typography>
            ) : (
              <Grid container spacing={3}>
                {bidders.map((bidder, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <BidderCard
                      name={bidder.userName}
                      date={new Date(
                        bidder.bidDetails.dateOfBids
                      ).toLocaleDateString()}
                      amount={bidder.bidDetails.bidOfAmount}
                      image={bidder.image}
                      onClick={() => setSelectedBidder(bidder)}
                    />
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        </>
      )}
    </Container>
  );
};

export default SinglePage;
