import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Avatar,
  Typography,
  Grid,
  Chip,
  Divider,
  Stack,
} from "@mui/material";

import StarIcon from "@mui/icons-material/Star";
import WorkIcon from "@mui/icons-material/Work";
import TagIcon from "@mui/icons-material/LocalOffer";
import DescriptionIcon from "@mui/icons-material/Description";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";

import ApiService from "../../services/ApiServices";
import getEnvVars from "../../config/env";

const ProfileCard = ({ bidder }) => {
  const { API_BASE_URL } = getEnvVars();
  const IMAGE_URL = `${API_BASE_URL}/images/bids`;

  const [ratings, setRatings] = useState([]);
  const [loadingRatings, setLoadingRatings] = useState(false);

  const fetchAllRatings = async () => {
    setLoadingRatings(true);
    try {
      const response = await ApiService.get("reviews/search", {
        params: {
          revieweeId: bidder?.bidDetails?.bidUserId,
        },
      });
      setRatings(response?.data || []);
    } catch (error) {
      console.error("Error fetching ratings:", error);
      setRatings([]);
    } finally {
      setLoadingRatings(false);
    }
  };

  useEffect(() => {
    if (bidder?.bidDetails?.bidUserId) {
      fetchAllRatings();
    }
  }, [bidder]);

  const totalRating = ratings.reduce((sum, r) => sum + r.rating, 0);
  const maxRating = ratings.length * 10;
  const aggregateRating =
    ratings.length > 0 ? `${totalRating}/${maxRating}` : "N/A";

  // Parse bid documents safely
  let documents = [];
  try {
    if (typeof bidder?.bidDetails?.biderDocument === "string") {
      documents = JSON.parse(bidder.bidDetails.biderDocument);
    } else if (Array.isArray(bidder?.bidDetails?.biderDocument)) {
      documents = bidder.bidDetails.biderDocument;
    }
  } catch (err) {
    console.error("Error parsing documents", err);
  }

  const openDocument = (doc) => {
    window.open(`${IMAGE_URL}/${doc}`, "_blank");
  };

  return (
    <Card sx={{ p: 2, borderRadius: 3, boxShadow: 3 }}>
      <CardContent>
        {/* HEADER */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar
              src={
                bidder?.profilePic
                  ? `${IMAGE_URL}/${bidder.profilePic}`
                  : undefined
              }
              sx={{ width: 70, height: 70 }}
            >
              {!bidder?.profilePic &&
                bidder?.userName?.charAt(0)?.toUpperCase()}
            </Avatar>

            <Box>
              <Typography fontWeight="bold">
                Bid ID: {bidder?.bidDetails?.BidId}
              </Typography>
              <Typography fontWeight="bold">
                {bidder?.userName || "N/A"}
              </Typography>

              <Typography variant="body2">
                Overall Rating: {aggregateRating}
                {ratings.length > 0 && " ⭐"}
              </Typography>

              <Typography variant="caption" color="text.secondary">
                ({ratings.length} ratings)
              </Typography>
            </Box>
          </Stack>

          <Chip
            label={bidder?.bidDetails?.status || "No Status"}
            color={
              bidder?.bidDetails?.status === "Completed" ? "success" : "warning"
            }
            sx={{ fontWeight: 600 }}
          />
        </Stack>

        <Divider sx={{ mb: 2 }} />

        {/* SKILLS */}
        <Grid container spacing={2} mb={2}>
          {bidder?.skills?.map((skill, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <Card variant="outlined" sx={{ p: 1.5 }}>
                <Typography fontWeight={600}>
                  <StarIcon fontSize="small" color="primary" /> Skill:{" "}
                  {skill.work}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <WorkIcon fontSize="small" color="success" /> Experience:{" "}
                  {skill.experience}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* BID AMOUNT */}
        <Box mb={2}>
          <Typography>
            <TagIcon color="primary" fontSize="small" /> Bid Amount:{" "}
            <strong>{bidder?.bidDetails?.bidOfAmount || "N/A"}</strong>
          </Typography>
        </Box>

        {/* DESCRIPTION */}
        <Box mb={2}>
          <Typography>
            <DescriptionIcon color="success" fontSize="small" /> Description:{" "}
            <strong>{bidder?.bidDetails?.description || "N/A"}</strong>
          </Typography>
        </Box>

        {/* DOCUMENTS */}
        <Box>
          <Typography fontWeight={600} mb={1}>
            <AttachFileIcon fontSize="small" color="warning" /> Bid Documents
          </Typography>

          {documents.length > 0 ? (
            documents.map((doc, index) => (
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                key={index}
                sx={{
                  cursor: "pointer",
                  color: "primary.main",
                  ml: 2,
                  mb: 0.5,
                }}
                onClick={() => openDocument(doc)}
              >
                <InsertDriveFileIcon fontSize="small" />
                <Typography
                  variant="body2"
                  sx={{ textDecoration: "underline" }}
                >
                  {doc}
                </Typography>
              </Stack>
            ))
          ) : (
            <Typography variant="body2" color="text.secondary">
              No documents uploaded
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProfileCard;
