import React from "react";
import { Box, Typography, Card, CardContent, Avatar, Badge } from "@mui/material";

const notifications = [
  {
    id: 1,
    title: "Best Offer For You",
    description: "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type.",
    image: "https://randomuser.me/api/portraits/women/79.jpg",
  },
  {
    id: 2,
    title: "Best Offer For You",
    description: "Its is a long Escalated Fact",
    viewMore: true,
    image: "https://randomuser.me/api/portraits/men/51.jpg",
  },
  {
    id: 3,
    title: "Best Offer For You",
    description: "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type.",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
  },
  {
    id: 4,
    title: "Best Offer For You",
    description: "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type.",
    image: "https://randomuser.me/api/portraits/men/25.jpg",
  },
];

const NotificationCard = ({ title, description, image, viewMore }) => (
  <Card
    sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      p: 2,
      mb: 2,
      boxShadow: "0px 2px 5px rgba(0,0,0,0.1)",
      borderRadius: 2,
      border: "1px solid #ccc",
    }}
  >
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Avatar src={image} sx={{ width: 56, height: 56, mr: 2 }} />
      <Box>
        <Typography variant="subtitle1" fontWeight="bold">
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
          {viewMore && (
            <Typography
              component="span"
              color="primary"
              sx={{ ml: 1, cursor: "pointer", fontWeight: "bold" }}
            >
              View More ......
            </Typography>
          )}
        </Typography>
      </Box>
    </Box>

    <Badge
      badgeContent={5}
      color="primary"
      sx={{
        "& .MuiBadge-badge": {
          fontSize: "1rem",
          width: 40,
          height: 40,
          borderRadius: "50%",
        },
      }}
    />
  </Card>
);

const NotificationsPage = () => {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" fontWeight="bold" mb={4} textAlign="center">
        Notifications
      </Typography>

      {notifications.map((notification) => (
        <NotificationCard key={notification.id} {...notification} />
      ))}
    </Box>
  );
};

export default NotificationsPage;
