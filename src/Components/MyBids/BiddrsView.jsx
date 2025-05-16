import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Card,
  Typography,
  Button,
  Rating,
  TextField,
} from "@mui/material";
import { AttachFile, Image, PictureAsPdf } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ChartBoard from '../../Components/ChatBoard/chatBoard';
import IconButton from '@mui/material/IconButton';
import Modal from '@mui/material/Modal';
import Close from '@mui/icons-material/Close'; // Alias Close -> CloseIcon


const TaskDetails = (props) => {
  const [totalTasks, setTotalTasks] = useState(0);
  const [disputeTasks, setDisputeTasks] = useState(0);
  const [completedTasks, setCompletedTasks] = useState(0);
  const [taskDocuments, setTaskDocuments] = useState([]);
  const [bidDocuments, setBidDocuments] = useState([]);

  const [tasks, setTasks] = useState([]);

 const [editing, setEditing] = useState(false);
  const [biddingAmount, setBiddingAmount] = useState(props.task.bidOfAmount || "");

  const [previewOpen, setPreviewOpen] = useState(false);
const [selectedDoc, setSelectedDoc] = useState(null);
const [fileName, setFileName] = useState("");
const [fileType, setFileType] = useState("");

const handleClose = () => {
  setPreviewOpen(false);
  setSelectedDoc(null);
  setFileName("");
  setFileType("");
};

  
  const navigate = useNavigate();


  useEffect(() => {
    if (Array.isArray(props.task?.biderDocument)) {
      setBidDocuments(props.task.biderDocument);
    }
  }, [props.task?.biderDocument,bidDocuments]);



   useEffect(() => {
    if (Array.isArray(props.task?.taskDocument)) {
      setTaskDocuments(props.task.taskDocument);
    }
  }, [props.task?.taskDocument,taskDocuments]);



  useEffect(() => {
    const fetchTaskById = async () => {
      try {
        const token = localStorage.getItem("token");
  
        if (!token) {
          console.error("Authorization token missing!");
          return;
        }
  
        if (!props.task?.taskId) {
          console.error("Task ID is missing!");
          return;
        }
  
        const response = await axios.get(
          `http://localhost:3001/task/get-task?taskId=${props.task.taskId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        if (response.data.success) {
          const task = response.data.data;


          setTasks([task]); // If expecting a single task, wrap in array or adjust your logic
          if (Array.isArray(task.biderDocument)) {
            setBidDocuments(task.biderDocument);
          } else {
            setBidDocuments([]);
          }

           setTasks([task]);
           if (Array.isArray(task.taskDocument)) {
            setTaskDocuments(task.taskDocument);
          } else {
            setTaskDocuments([]);
          }
          
        } else {
          console.error("Failed to fetch task");
        }
      } catch (error) {
        console.error("Error fetching task:", error);
      }
    };
  
    fetchTaskById();
  }, [props.task?.taskId]);
  

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



const handleUpdateBid = async () => {
  try {
    const response = await axios.put(
      `http://localhost:3001/Bids/update/${props.task.BidId}`,
      {
        bidOfAmount: biddingAmount, // Only update fields needed
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





  return (
    <Box p={2} mt={2}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box display="flex" justifyContent="space-between" mb={2}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => props.onBack()}
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
              onClick={handleUpdateBid}
              sx={{ fontSize: "1rem", fontWeight: "bold" }}
            >
              Submit
            </Button>
          )}
        </Box>
      </Grid>

      <Grid item xs={12}>
        <Grid container spacing={2} alignItems="stretch">
          {/* Category Card */}
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 2, border: "2px solid #ddd", height: "100%" }}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h5" fontWeight="bold">
                  Category: {props.task.Categories}
                </Typography>
                <Typography variant="body2" color="textSecondary" fontWeight="bold">
                  {props.task.daysLeft}
                </Typography>
              </Box>

              <Box display="flex" justifyContent="space-between" mt={1}>
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

                <Typography fontSize="1.2rem" fontWeight="bold">
                  Status: {props.task.status}
                </Typography>
              </Box>

              <Box display="flex" justifyContent="space-between" mt={1}>
                <Typography fontSize="1.2rem" fontWeight="bold">
                  Posted in: {new Date(props.task.targetedPostIn).toLocaleDateString()}
                </Typography>
              </Box>

              <Box display="flex" justifyContent="space-between" mt={2} alignItems="center">
                <Button
                  variant="contained"
                  color="success"
                  sx={{
                    fontWeight: "bold",
                    fontSize: "1rem",
                    px: 2,
                    borderRadius: 2,
                  }}
                >
                  Task Amount: ₹{props.task.amount || "N/A"}
                </Button>

                {!editing ? (
                  <Button
                    variant="outlined"
                    color="success"
                    sx={{
                      fontWeight: "bold",
                      fontSize: "1rem",
                      px: 2,
                      borderRadius: 2,
                    }}
                  >
                    Bidding Amount: ₹{props.task.bidOfAmount || "N/A"}
                  </Button>
                ) : (
                  <TextField
                    label="Bidding Amount"
                    type="number"
                    size="small"
                    value={biddingAmount}
                    onChange={(e) => setBiddingAmount(e.target.value)}
                    sx={{ width: 180 }}
                  />
                )}
              </Box>

      </Card>
    </Grid>

    {/* Description Card */}
    <Grid item xs={12} md={6}>
      <Card sx={{ p: 2, border: "2px solid #ddd", height: "100%" }}>
        <Typography variant="h6" fontWeight="bold">
          Description:
        </Typography>
        <Typography mt={1} fontSize="1.1rem">
          {props.task.description}
        </Typography>
      </Card>
    </Grid>
  </Grid>
</Grid>


        {/* Task Owner Details */}
        <Grid item xs={12} mt={5}>
          <Typography variant="h5" mb={5} fontWeight="bold">
            Task Owner Details
          </Typography>
          <Card sx={{ p: 3, mt: 1, border: "1px solid #ccc" }}>
            <Grid container spacing={2}>
              <Grid item xs={6} md={3}>
                <Typography fontWeight="bold" fontSize="1.3rem">
                  Total Task :
                </Typography>
                <Typography fontSize="1.2rem">{totalTasks}</Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography fontWeight="bold" fontSize="1.3rem">
                  Dispute Task
                </Typography>
                <Typography fontSize="1.2rem">{disputeTasks}</Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography fontWeight="bold" fontSize="1.3rem">
                  Completed Task
                </Typography>
                <Typography fontSize="1.2rem">{completedTasks}</Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography fontWeight="bold" fontSize="1.3rem">
                  Points :
                </Typography>
                <Typography fontSize="1.2rem">350</Typography>
                <Rating value={4} readOnly precision={0.5} />
              </Grid>
            </Grid>
          </Card>
        </Grid>



      <Grid item xs={12}>
       <Typography variant="h5" mb={2} fontWeight="bold">
      Task  Documents
       </Typography>
       <Card sx={{ p: 3, border: "2px solid #ccc" }}>
         <Grid container spacing={2}>
           {taskDocuments.length > 0 ? (
             taskDocuments.map((docFileName, index) => {
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
                     {/* <Typography ml={1}>{name}</Typography> */}
                   </Box>
                 </Grid>
               );
             })
           ) : (
             <Grid item xs={12}>
               <Typography>No documents found.........</Typography>
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
     


 <Grid item xs={12}>
       <Typography variant="h5" mb={2} fontWeight="bold">
        Bider Documents
       </Typography>
       <Card sx={{ p: 3, border: "2px solid #ccc" }}>
         <Grid container spacing={2}>
           {bidDocuments.length > 0 ? (
             bidDocuments.map((docFileName, index) => {
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
                     {/* <Typography ml={1}>{name}</Typography> */}
                   </Box>
                 </Grid>
               );
             })
           ) : (
             <Grid item xs={12}>
               <Typography>No documents found.........</Typography>
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






        {/* Chat Board Section */}
        <Grid item xs={12} mt={5}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Chat Board
          </Typography>
          <ChartBoard task={props.task} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default TaskDetails;
