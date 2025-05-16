import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Card,
  Typography,
  Grid,
  Button,
  Paper,
  IconButton,
  Avatar,
} from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import DescriptionIcon from '@mui/icons-material/Description';
import ImageIcon from '@mui/icons-material/Image';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import WorkIcon from '@mui/icons-material/Work';
import StarIcon from '@mui/icons-material/Star';
import ChartBoard from '../../Components/ChatBoard/chatBoard';

// Reusable Document Card
const DocumentCard = ({ icon, label, fileUrl }) => (
  <Paper
    elevation={3}
    sx={{
      display: 'flex',
      alignItems: 'center',
      gap: 2,
      p: 2,
      borderRadius: 3,
      transition: 'transform 0.3s, box-shadow 0.3s',
      '&:hover': {
        transform: 'scale(1.03)',
        boxShadow: 6,
      },
      cursor: 'pointer',
      minWidth: 250,
    }}
    onClick={() => window.open(fileUrl, '_blank')}
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
    const ext = filename.split('.').pop().toLowerCase();
    if (ext === 'pdf') return <PictureAsPdfIcon fontSize="inherit" />;
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp'].includes(ext)) return <ImageIcon fontSize="inherit" />;
    return <DescriptionIcon fontSize="inherit" />;
  };

  const baseUrl = 'http://localhost:3001/storege/userdp/';

  return (
    <Box mb={5}>
      <Typography variant="h5" fontWeight="bold" color="primary" mb={2}>
        {title}
      </Typography>
      <Grid container spacing={3}>
        {documents.length > 0 ? (
          documents.map((file, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <DocumentCard icon={getIcon(file)} label={file} fileUrl={`${baseUrl}${file}`} />
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

// Skill Card
const SkillCard = ({ skill, experience }) => (
  <Paper
    elevation={3}
    sx={{
      p: 2,
      background: '#f3f3f3',
      borderRadius: 3,
      minWidth: 200,
      transition: '0.3s',
      '&:hover': {
        transform: 'scale(1.02)',
        boxShadow: 6,
      },
    }}
  >
    <Typography variant="subtitle1" fontWeight="bold">
      <StarIcon sx={{ fontSize: 18, mr: 1, color: '#1976d2' }} />
      Skill: {skill}
    </Typography>
    <Typography variant="subtitle2" color="text.secondary" mt={1}>
      <WorkIcon sx={{ fontSize: 18, mr: 1, color: '#43a047' }} />
      Experience: {experience}
    </Typography>
    <Box mt={1} sx={{ borderBottom: '2px solid #000', width: '100%' }} />
  </Paper>
);

// Profile Card with bidder prop
const ExciteProfileCard = ({ bidder }) => (
  <Card
    elevation={6}
    sx={{
      p: 4,
      borderRadius: 4,
      background: 'linear-gradient(to right, #ffffff, #f9f9f9)',
      boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
      maxWidth: 2000,
      margin: 'auto',
    }}
  >
    <Box display="flex" alignItems="center" mb={4}>
      <Avatar
        alt="Bidder"
        src={
          bidder?.profilePic
            ? `http://localhost:3001/storege/userdp/${bidder.profilePic}`
            : ''
        }
        sx={{ width: 70, height: 70, mr: 3, border: '2px solid orange' }}
      />
      <Box>
        <Typography variant="h6" fontWeight="bold">
          {bidder?.userName || 'N/A'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Experience: {bidder?.bidder?.experience || 'N/A'} Yrs
        </Typography>
      </Box>
    </Box>

    <Grid container spacing={3}>
      {[1, 2, 3, 4].map((_, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <SkillCard skill="Social Media" experience="3 years" />
        </Grid>
      ))}
    </Grid>
  </Card>
);

// Main Component
const BidderDisputeCard = ({ task }) => {
  const [bidders, setBidders] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchBidders = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/Bids/users-by-task/${task.taskId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
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
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        bgcolor="#083bb6"
        p={2}
        borderRadius={2}
        color="#fff"
        boxShadow={3}
        mt={10}
        mb={5}
      >
        <Typography variant="h6" fontWeight="bold">
          Bidder Dispute
        </Typography>
        <ArrowForwardIosIcon />
      </Box>

      <Grid item xs={12}>
        <Box display="flex" gap={2}>
          <Card sx={{ p: 2, width: '50%', border: '1px solid #ccc' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6" fontWeight="bold">
                Category: {task.Categories}
              </Typography>
              <Typography variant="body2" color="textSecondary" fontWeight="bold">
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
                sx={{ fontWeight: 'bold', fontSize: '1.3rem', px: 3, borderRadius: 8 }}
              >
                {task.amount}
              </Button>
            </Box>
          </Card>

          <Card sx={{ p: 2, width: '50%', border: '1px solid #ccc' }}>
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
        <DocumentSection title="Task Owner Document" documents={task.document || []} />
        <DocumentSection title="Bidder Document" documents={task.document || []} />
      </Box>

      <Box mt={10}>
        {/* Show first bidder for now */}
        {bidders.length > 0 && <ExciteProfileCard bidder={bidders[0]} />}
      </Box>

      <Box mt={10}>
        <ChartBoard />
      </Box>
    </Box>
  );
};

export default BidderDisputeCard;
