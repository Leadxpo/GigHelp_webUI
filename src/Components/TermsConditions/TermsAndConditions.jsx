import React, { useState, useEffect } from "react";
import { Box, Typography, Divider } from "@mui/material";

const TermsConditions = () => {
  const [paragraph, setParagraph] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setParagraph("No token found. Please log in.");
      return;
    }

    fetch(`http://localhost:3001/tc/get-latest`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data?.description) {
          setParagraph(data.data.description);
        } else {
          setParagraph(`Error: ${data.message || "No description found."}`);
        }
      })
      .catch((err) => {
        console.error("Fetch failed:", err);
        setParagraph("Error fetching Terms and Conditions.");
      });
  }, []);

  return (
  <Box
    sx={{
      px: { xs: 2, sm: 3, md: 6 },
      py: { xs: 3, sm: 4, md: 6 },
      maxWidth: "1000px",
      mx: "auto",
    }}
  >
    <Typography
      variant="h4"
      align="center"
      fontWeight="bold"
      gutterBottom
      fontSize={{ xs: "1.8rem", sm: "2rem", md: "2.5rem" }}
    >
      Terms and Conditions
    </Typography>

    <Divider
      sx={{
        mb: { xs: 3, sm: 4 },
        borderColor: "grey.300",
      }}
    />

    <Typography
      variant="body1"
      paragraph
      fontSize={{ xs: "0.95rem", sm: "1rem", md: "1.1rem" }}
      lineHeight={1.7}
    >
      {paragraph}
    </Typography>
  </Box>
);

};

export default TermsConditions;
