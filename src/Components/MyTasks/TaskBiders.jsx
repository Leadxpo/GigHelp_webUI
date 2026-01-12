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
import { useLocation, useParams, useNavigate } from "react-router-dom";
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
import ApiService from "../../services/ApiServices";

// CategoryCard section
const CategoryCard = () => {
  const navigate = useNavigate();
  const { taskId } = useParams();
  const { state } = useLocation();
  const task = state?.task;

  const [documents, setDocuments] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [fileName, setFileName] = useState("");
  const [fileType, setFileType] = useState("");
  const [editing, setEditing] = useState(false);
  const [amount, setAmount] = useState(task.amount || "");
  const [description, setDescription] = useState(task.description || "");
  const [endDate, setEndDate] = useState(task.endData || "");
  const [newFiles, setNewFiles] = useState([]);

  const handleClose = () => {
    setPreviewOpen(false);
    setSelectedDoc(null);
  };

  useEffect(() => {
    if (Array.isArray(task?.document)) {
      setDocuments(task.document);
    }
  }, [task?.document]);

  // ✅ Handle File Selection
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setNewFiles((prev) => [...prev, ...files]);
  };

  // ✅ Handle File Deletion (locally)
  const handleDeleteFile = (fileName) => {
    setDocuments((prev) => prev.filter((doc) => doc !== fileName));
  };

  // ✅ Submit updates
  const handleUpdateTask = async () => {
    const token = localStorage.getItem("token");

    try {
      const formData = new FormData();
      formData.append("amount", amount);
      formData.append("description", description);
      formData.append("endData", endDate);

      documents.forEach((doc, i) => formData.append("existingDocs[]", doc));
      newFiles.forEach((file) => formData.append("newDocs", file));

      const response = await ApiService.put(
        `/task/update/${task.taskId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        alert("Task updated successfully!");
        setEditing(false);
      } else {
        alert("Update failed.");
      }
    } catch (error) {
      console.error("Error updating task:", error);
      alert("Error updating task.");
    }
  };

  return (
    <Box sx={{ mt: 10, px: 1 }}>
      {/* Top Buttons */}
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Button variant="outlined" onClick={() => navigate(-1)}>
          ← Back
        </Button>
        {!editing ? (
          <Button variant="contained" onClick={() => setEditing(true)}>
            Edit
          </Button>
        ) : (
          <Button
            variant="contained"
            color="success"
            onClick={handleUpdateTask}
          >
            Submit
          </Button>
        )}
      </Box>

      {/* Main Grid: Task Info, Category, Description */}
      <Grid container spacing={2}>
        {/* Task Info Card */}
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 2, border: "1px solid #ccc", height: "100%" }}>
            <Typography variant="h6" fontWeight="bold" mb={2}>
              Task Information
            </Typography>

            {/* Inner Grid for Label-Value alignment */}
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1" fontWeight="bold">
                  Task ID:
                </Typography>
                <Typography>{task.taskId}</Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="body1" fontWeight="bold">
                  Category:
                </Typography>
                <Typography>{task.Categories}</Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="body1" fontWeight="bold">
                  Sub Category:
                </Typography>
                <Typography>{task.SubCategory}</Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="body1" fontWeight="bold">
                  Status:
                </Typography>
                <Typography>{task.status}</Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="body1" fontWeight="bold">
                  Target Date:
                </Typography>
                {editing ? (
                  <TextField
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    size="small"
                  />
                ) : (
                  <Typography>
                    {new Date(task.endData).toLocaleDateString()}
                  </Typography>
                )}
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="body1" fontWeight="bold">
                  Posted On:
                </Typography>
                <Typography>
                  {new Date(task.createdAt).toLocaleDateString()}
                </Typography>
              </Grid>
            </Grid>

            {/* Amount Section */}
            <Box mt={3}>
              {editing ? (
                <TextField
                  fullWidth
                  type="number"
                  label="Amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              ) : (
                <Button variant="contained" color="primary">
                  ₹ {task.amount}
                </Button>
              )}
            </Box>
          </Card>
        </Grid>

        {/* Description Card */}
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 2, border: "1px solid #ccc", height: "100%" }}>
            <Typography variant="h6" fontWeight="bold">
              Description
            </Typography>
            {editing ? (
              <TextField
                fullWidth
                multiline
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            ) : (
              <Typography mt={1}>{task.description}</Typography>
            )}
          </Card>
        </Grid>
      </Grid>

      {/* Documents Section */}
      <Card sx={{ p: 3, mt: 3, border: "1px solid #ccc" }}>
        <Typography variant="h6" fontWeight="bold" mb={2}>
          Documents
        </Typography>
        <Grid container spacing={2}>
          {documents.length > 0 ? (
            documents.map((doc, index) => {
              const docUrl = `http://localhost:3001/storege/userdp/${doc}`;
              const ext = doc.split(".").pop().toLowerCase();
              const Icon = ["jpg", "jpeg", "png"].includes(ext)
                ? Image
                : ext === "pdf"
                ? PictureAsPdf
                : AttachFile;

              return (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Box display="flex" alignItems="center">
                    <IconButton
                      onClick={() => {
                        setSelectedDoc(docUrl);
                        setFileName(doc);
                        setFileType(ext === "pdf" ? "pdf" : "image");
                        setPreviewOpen(true);
                      }}
                    >
                      <Icon fontSize="large" />
                    </IconButton>
                    <Typography ml={1}>{doc}</Typography>
                    {editing && (
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteFile(doc)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </Box>
                </Grid>
              );
            })
          ) : (
            <Typography>No documents found</Typography>
          )}
        </Grid>

        {editing && (
          <Box mt={3}>
            <Button variant="outlined" component="label">
              + Add Documents
              <input
                type="file"
                multiple
                hidden
                onChange={handleFileChange}
                accept="image/*,.pdf"
              />
            </Button>
            {newFiles.length > 0 && (
              <Typography mt={1}>
                {newFiles.length} new file(s) selected
              </Typography>
            )}
          </Box>
        )}
      </Card>

      {/* Modal for Document Preview */}
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
        </Box>
      </Modal>
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

const SinglePage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const task = location.state?.task;
  const [selectedBidder, setSelectedBidder] = useState(null);
  const [bidders, setBidders] = useState([]);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [taskData, setTaskData] = useState(task);

  useEffect(() => {
    // const fetchData = async () => {
    //   try {
    //     const [biddersRes, bidsRes] = await Promise.all([
    //       ApiService.get(`/Bids/users-by-task/${task.taskId}`, {
    //         // headers: {
    //         //   Authorization: `Bearer ${token}`,
    //         //   "Content-Type": "application/json",
    //         // },
    //       }),
    //       ApiService.get("/Bids/get-all-bids", {
    //         // headers: {
    //         //   Authorization: `Bearer ${token}`,
    //         //   "Content-Type": "application/json",
    //         // },
    //       }),
    //     ]);

    //     const allBids = bidsRes.data.data || [];
    //     const filteredBids = allBids.filter((bid) => bid.taskId == task.taskId); // loosely match

    //     const rawBidders = biddersRes.data.data || [];

    //     console.log("rawBidders >", rawBidders);
    //     console.log("filteredBids >", filteredBids);

    //     const combined = rawBidders.map((bidder) => {
    //       const bidInfo = filteredBids.find(
    //         (bid) => bid.userId == bidder.userId
    //       ); // loose match here too
    //       return {
    //         ...bidder,
    //         bidDetails: bidInfo || null,
    //       };
    //     });

    //     setBids(filteredBids);
    //     setBidders(combined);
    //   } catch (error) {
    //     console.error("Error fetching data:", error);
    //     setBidders([]);
    //     setBids([]);
    //   } finally {
    //     setLoading(false);
    //   }
    // };

    console.log("task in bidder page>>");
    const fetchData = async () => {
      setLoading(true);
      console.log("Fetching data for task:");
      try {
        const [taskRes, bidderRes, bidsRes] = await Promise.all([
          ApiService.get("/task/get-task", {
            taskId: task.taskId,
          }),
          ApiService.get(`/Bids/users-by-task/${task.taskId}`),
          ApiService.get("/Bids/get-all-bids"),
        ]);

        console.log("<<< task data from api", taskRes);

        setTaskData(taskRes.data);

        const filtered = (bidsRes.data || []).filter(
          (b) => b.taskId == task.taskId
        );
        console.log(filtered, "<<< filtered bids for the task");

        const allBidders = (bidderRes.data || []).map((bidder) => {
          const bid = filtered.find((b) => b.userId == bidder.userId);
          return { ...bidder, bidDetails: bid };
        });

        setBidders(allBidders);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (task?.taskId) {
      fetchData();
    }
  }, [task?.taskId]);

  console.log("biddereeeee>", bidders);

  return (
    <Container maxWidth="1100" sx={{ mb: 4, mt: 10 }}>
      {/* {selectedBidder ? (
        <>
          <Button
            variant="outlined"
            onClick={() => setSelectedBidder(null)}
            sx={{ mb: 2, mt: 5 }}
          >
            Back to Bidders
          </Button>
          <BidderDetails
            bidder={selectedBidder}
            task={taskData}
            setSelectedBidder={setSelectedBidder}
          />
        </>
      ) : ( */}
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
                      // onClick={() => setSelectedBidder(bidder)}
                      onClick={() =>
                        navigate(
                          `/my-tasks/${task.taskId}/bidder/${bidder.bidDetails.BidId}`,
                          {
                            state: {
                              task: taskData,
                              bidder: bidder,
                            },
                          }
                        )
                      }
                    />
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        </>
      {/* )} */}
    </Container>
  );
};

export default SinglePage;
