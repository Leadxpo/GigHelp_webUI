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
      flexDirection: { xs: "column", sm: "row" },
      alignItems: { xs: "flex-start", sm: "center" },
      justifyContent: "space-between",
      p: { xs: 2, sm: 2 },
      mb: 2,
      boxShadow: "0px 2px 5px rgba(0,0,0,0.1)",
      borderRadius: 2,
      border: "1px solid #ccc",
      gap: 2,
    }}
  >
    {/* Avatar and text */}
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        flex: 1,
        flexDirection: "row",
        gap: 2,
        width: "100%",
      }}
    >
      <Avatar src={image} sx={{ width: 56, height: 56 }} />
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
              View More...
            </Typography>
          )}
        </Typography>
      </Box>
    </Box>

    {/* Badge */}
    <Box
      sx={{
        mt: { xs: 2, sm: 0 },
        alignSelf: { xs: "flex-end", sm: "center" },
      }}
    >
      <Badge
        badgeContent={5}
        color="primary"
        sx={{
          "& .MuiBadge-badge": {
            fontSize: "1rem",
            width: 32,
            height: 32,
            borderRadius: "50%",
          },
        }}
      />
    </Box>
  </Card>
);

const NotificationsPage = () => {
  return (
  <Box
    sx={{
      px: { xs: 2, sm: 3, md: 5 },
      py: { xs: 2, sm: 3, md: 4 },
      width: "90%",
      maxWidth: 1000,
      mx: "auto",
    }}
  >
    <Typography
      variant="h4"
      fontWeight="bold"
      mb={4}
      textAlign="center"
      fontSize={{ xs: "1.8rem", sm: "2.2rem", md: "2.5rem" }}
    >
      Notifications
    </Typography>

    {notifications.map((notification) => (
      <NotificationCard key={notification.id} {...notification} />
    ))}
  </Box>
);

};

export default NotificationsPage;
