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
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" align="center" fontWeight="bold" gutterBottom>
        Terms and Conditions
      </Typography>

      <Divider sx={{ mb: 4, borderColor: "grey.300" }} />

      <Typography variant="body1" paragraph>
        {paragraph}
      </Typography>
    </Box>
  );
};

export default TermsConditions;
