import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import Footer from "../../Components/Footer/Footer";

const statusColor = {
  completed: "#4CAF50",
  failed: "#F44336",
  pending: "#FF9800",
};

const CustomPaper = styled(Paper)(({ status }) => ({
  padding: 16,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  border: `1px solid ${statusColor[status]}`,
  borderRadius: 12,
  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
  flexWrap: "wrap",
}));

const StatusButton = styled(Button)(({ status }) => ({
  backgroundColor: statusColor[status],
  color: "white",
  borderRadius: 20,
  padding: "4px 16px",
  textTransform: "none",
  fontWeight: "bold",
  fontSize: 14,
  "&:hover": {
    backgroundColor: statusColor[status],
    opacity: 0.9,
  },
}));

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.userId;
  const userName = user?.userName;

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3001/transections/get-by-user/${userId}`
        );
        setTransactions(res.data.data || []);
      } catch (error) {
        console.error("Failed to fetch transactions", error);
      }
    };

    if (userId) {
      fetchTransactions();
    }
  }, [userId]);

  return (
    <>
      <Box
        sx={{
          px: { xs: 2, sm: 3, md: 5 },
          py: { xs: 4, sm: 6 },
        }}
      >
        <Typography
          variant="h5"
          fontWeight="bold"
          mb={1}
          fontSize={{ xs: "1.2rem", sm: "1.5rem" }}
        >
          Hello,
        </Typography>
        <Typography
          variant="h4"
          fontWeight="bold"
          mb={4}
          fontSize={{ xs: "1.8rem", sm: "2.2rem" }}
        >
          {userName}
        </Typography>

        <Typography
          variant="h3"
          align="center"
          fontWeight="bold"
          mb={5}
          fontSize={{ xs: "1.8rem", sm: "2.5rem" }}
        >
          Transactions
        </Typography>

        <Box
          sx={{
            maxWidth: "100%",
            mx: "auto",
            p: { xs: 2, sm: 3, md: 4 },
            background: "#fff",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <Box
            sx={{
              display: "flex",
              // flexDirection: { xs: "column", sm: "row" },
              justifyContent: "space-between",
              alignItems: { xs: "flex-start", sm: "center" },
              mb: 4,
              gap: 2,
            }}
          >
            <Typography variant="h6" fontWeight="bold">
              Transactions
            </Typography>
            <Button
              sx={{
                color: "#1976d2",
                textTransform: "none",
                fontWeight: "bold",
              }}
            >
              Show All
            </Button>
          </Box>

          <Grid container spacing={3}>
            {transactions.map((item, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <CustomPaper status={item.status}>
                  <Box>
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      fontSize={{ xs: "1rem", sm: "1.2rem" }}
                    >
                      ₹{item.amount}
                    </Typography>
                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                      fontSize={{ xs: "0.9rem", sm: "1rem" }}
                    >
                      {item.categoryName}
                    </Typography>
                    <Typography variant="caption">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </Typography>
                  </Box>
                  <StatusButton status={item.status}>
                    {item.status}
                  </StatusButton>
                </CustomPaper>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
      <Footer />
    </>
  );
};

export default TransactionsPage;
