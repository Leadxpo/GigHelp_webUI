import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  MenuItem,
  Select,
  TextField,
  Typography,
  Grid,
  InputLabel,
  FormControl,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import axios from "axios";
import Footer from "../../Components/Footer/Footer";
import { useNavigate } from "react-router-dom";
import ApiService from "../../services/ApiServices";

const TaskManager = () => {
  const navigate = useNavigate();

  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  // const [postedIn, setPostedIn] = useState("");
  const [endDate, setEndDate] = useState("");
  const [amount, setAmount] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState([]);

  const [categoryList, setCategoryList] = useState([]);
  const [subCategoryList, setSubCategoryList] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [users, setUsers] = useState([]);

  const [user, setUser] = useState(null);
  const [showVerifyKYC, setShowVerifyKYC] = useState(false);
  const [showRejectedKYC, setShowRejectedKYC] = useState(false);

  const resetForm = () => {
    setCategory("");
    setSubCategory("");
    setFrom("");
    setTo("");
    // setPostedIn("");
    setEndDate("");
    setAmount("");
    setPhoneNumber("");
    setDescription("");
    setFiles([]);

    const fileInput = document.getElementById("fileUpload");
    if (fileInput) {
      fileInput.value = null; // Clear file input manually
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await ApiService.get(
          "/categories/get-all"
          // {
          //   headers: { Authorization: `Bearer ${token}` },
          // }
        );
        setCategoryList(res.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchSubCategories = async () => {
      if (!category) return;
      try {
        const token = localStorage.getItem("token");
        const res = await ApiService.get(
          `/subcategories/get-all-categoryId?categoryId=${category}`,
          // {
          //   headers: { Authorization: `Bearer ${token}` },
          // }
        );
        setSubCategoryList(res.data);
        console.log(res.data, "sub category");

      } catch (error) {
        console.error("Error fetching subcategories:", error);
      }
    };
    
    // const fetchSubCategories = async () => {
    //   if (!category) return;
    //   try {
    //     const res = await ApiService.get(
    //       `/subcategories/get-all-categoryId?categoryId=${category}`
    //     );
    //     const formatted = res.data.map((item) => ({
    //       label: item.SubCategoryName,
    //       value: item.SubCategoryId,
    //     }));
    //     setSubCategoryList(formatted);

    //     console.log(formatted, "sub category");

    //     const selected = categoryList.find((cat) => cat.value === category);
    //     setCategoryName(selected?.label || "");

    //     if (selected?.label?.toLowerCase() === "transport") {
    //       setFrom("Default From Location");
    //       setTo("Default To Location");
    //     } else {
    //       setFrom("");
    //       setTo("");
    //     }
    //   } catch (error) {
    //     console.error("Error fetching subcategories:", error);
    //   }
    // };
    fetchSubCategories();
  }, [category]);

  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
  };

  useEffect(() => {
    const fetchAllUsers = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("Authorization token missing!");
        return;
      }

      // const fetchData = async () => {
      //   try {
      //     const response = await ApiService.get('systemuser/get-user', {
      //       userId,
      //     });
      //     console.log(response, 'userrrrraaaaa');
      //     setUser(response.data);
      //   } catch (error) {
      //     console.log('Error fetching profile:', error);
      //   }

      try {
        const response = await ApiService.get(
          "/user/all-user"
          // {
          //   headers: {
          //     Authorization: `Bearer ${token}`,
          //   },
          // }
        );

        if (response.success) {
          setUsers(response.data); // assuming the users are in `data`
          console.log("==========>", users);
        } else {
          console.error("Failed to fetch users");
        }
      } catch (error) {
        console.error(
          "Error fetching users:",
          error.response?.data || error.message
        );
      }
    };

    fetchAllUsers();
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      const storedUser = JSON.parse(localStorage.getItem("user"));

      if (!storedUser?.userId) return;

      try {
        const res = await ApiService.get(
          "/user/get-user"
          // {
          //   // params: { userId: storedUser.userId },
          //   headers: { Authorization: `Bearer ${token}` },
          // }
        );
        console.log("Fetched User:", res.data);
        setUser(res.data);
      } catch (err) {
        console.error("User fetch error:", err);
      }
    };
    fetchUser();
  }, []);

  const handleSubmit = async () => {
    // KYC CHECK (RN MATCH)
    if (user.status === "Pending") {
      setShowVerifyKYC(true);
      return;
    }
    if (user.status === "Rejected") {
      setShowRejectedKYC(true);
      return;
    }

    if (!category || !subCategory) {
      alert("Please select category and sub category");
      return;
    }

    if (categoryName.toLowerCase() === "transport" && (!from || !to)) {
      alert("Please fill From & To");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const userData = JSON.parse(localStorage.getItem("user"));

      if (!token || !userData?.userId) {
        alert("Authorization token or user data missing!");
        return;
      }

      // Find the current logged-in user's full record from fetched users
      const currentUser = users.find((user) => user.userId === userData.userId);

      if (!currentUser || currentUser.status !== "Approved") {
        alert("KYC Pending: Not permitted to add task");
        return;
      }

      const selectedCategory = categoryList.find(
        (cat) => cat.categoryId === category
      );
      const selectedSubCategory = subCategoryList.find(
        (sub) => sub.SubCategoryId === subCategory
      );

      const categoryName = selectedCategory?.categoryName || "";
      const subCategoryName = selectedSubCategory?.SubCategoryName || "";

      const formData = new FormData();
      formData.append("task", categoryName);
      formData.append("Categories", categoryName);
      formData.append("SubCategory", subCategoryName);
      // formData.append("targetedPostIn", postedIn);
      formData.append("endData", endDate);
      formData.append("amount", amount);
      formData.append("phoneNumber", phoneNumber);
      formData.append("description", description);
      formData.append("from", from);
      formData.append("to", to);
      formData.append("taskUserId", userData.userId);
      formData.append("userId", userData.userId);
      formData.append("status", "pending");

      files.forEach((file) => {
        formData.append("document", file);
      });

      const response = await ApiService.post(
        "/task/create",
        formData
        // {
        //   headers: {
        //     Authorization: `Bearer ${token}`,
        //     "Content-Type": "multipart/form-data",
        //   },
        // }
      );

      console.log("Task Creation Response:", response);

      if (response.success) {
        alert(response.message);
        resetForm();
      }
    } catch (error) {
      console.error("Error submitting task:", error);
      alert("An error occurred while creating the task");
    }
  };

  return (
    <>
      <Box
        sx={{
          px: { xs: 1, sm: 3 },
          py: { xs: 3, sm: 4 },
          bgcolor: "#FFFFFF",
          minHeight: "100vh",
        }}
      >
        <Typography
          variant="h5"
          align="center"
          fontWeight="bold"
          mb={3}
          sx={{ fontSize: { xs: "1.6rem", sm: "2rem" } }}
        >
          Add Tasks
        </Typography>

        <Box
          sx={{
            width: "100%",
            maxWidth: { xs: "90%", sm: "90%", md: "70%" },
            mx: "auto",
            p: { xs: 2, sm: 3 },
            bgcolor: "white",
            borderRadius: 2,
            boxShadow: 3,
          }}
        >
          {/* Category */}
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={category}
              onChange={(e) => {
                const selectedId = e.target.value;
                setCategory(selectedId);

                const selected = categoryList.find(
                  (cat) => cat.categoryId === selectedId
                );
                setCategoryName(selected?.categoryName || "");

                if (selected?.categoryName?.toLowerCase() === "transport") {
                  setFrom("Default From Location");
                  setTo("Default To Location");
                } else {
                  setFrom("");
                  setTo("");
                }
              }}
              label="Category"
            >
              {categoryList?.map((cat) => (
                <MenuItem key={cat.categoryId} value={cat.categoryId}>
                  {cat.categoryName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Sub Category */}
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Sub Category</InputLabel>
            <Select
              value={subCategory}
              onChange={(e) => setSubCategory(e.target.value)}
              label="Sub Category"
              disabled={!category || subCategoryList.length === 0}
            >
              {subCategoryList.map((sub) => (
                <MenuItem key={sub.SubCategoryId} value={sub.SubCategoryId}>
                  {sub.SubCategoryName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Transport Locations */}
          {categoryName.toLowerCase() === "transport" && (
            <>
              <TextField
                fullWidth
                label="From"
                variant="outlined"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                sx={{ mb: 2 }}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                fullWidth
                label="To"
                variant="outlined"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                sx={{ mb: 2 }}
                InputLabelProps={{ shrink: true }}
              />
            </>
          )}

          {/* End Date */}
          <TextField
            fullWidth
            label="End Date"
            type="date"
            variant="outlined"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            sx={{ mb: 2 }}
            InputLabelProps={{ shrink: true }}
          />

          {/* Amount */}
          <TextField
            fullWidth
            label="Amount"
            type="number"
            variant="outlined"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            sx={{ mb: 2 }}
          />

          {/* Phone Number */}
          {/* <TextField
          fullWidth
          label="Phone Number"
          variant="outlined"
          type="tel"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          sx={{ mb: 2 }}
        /> */}

          {/* Description */}
          <TextField
            fullWidth
            label="Description"
            variant="outlined"
            multiline
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            sx={{ mb: 2 }}
          />

          {/* Upload Section */}
          <Typography variant="h6" fontWeight="bold" mt={3} mb={1}>
            Upload Files
          </Typography>

          <Box
            sx={{
              border: "2px dashed #ccc",
              borderRadius: 2,
              p: 2,
              textAlign: "center",
              backgroundColor: "#f9f9f9",
              cursor: "pointer",
              mb: 2,
              minHeight: { xs: 100, sm: 140 },
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
            onClick={() => document.getElementById("fileUpload").click()}
          >
            <Typography
              variant="body1"
              sx={{ fontSize: { xs: 14, sm: 16 }, mb: 1 }}
            >
              Click to upload files or drag them here
            </Typography>
            <input
              id="fileUpload"
              type="file"
              multiple
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
          </Box>

          <Typography variant="body2" color="textSecondary" mb={2}>
            {files.length > 0
              ? `${files.length} file(s) selected`
              : "No files selected"}
          </Typography>

          {/* Submit Button */}
          <Box mt={4} textAlign="center">
            <Button
              variant="contained"
              color="primary"
              sx={{
                fontSize: { xs: 16, sm: 20 },
                fontWeight: "bold",
                px: 4,
                py: 1.5,
                width: { xs: "100%", sm: "auto" },
              }}
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </Box>
        </Box>
      </Box>

      <Box mt={4}>
        <Footer />
      </Box>

      <Dialog open={showVerifyKYC} onClose={() => setShowVerifyKYC(false)}>
        <DialogTitle>KYC Verifying</DialogTitle>
        <DialogContent>
          <Typography>You can’t add task until approved</Typography>
          <Button onClick={() => navigate("/profile")}>For More</Button>
        </DialogContent>
      </Dialog>

      <Dialog open={showRejectedKYC} onClose={() => setShowRejectedKYC(false)}>
        <DialogTitle>KYC Rejected</DialogTitle>
        <DialogContent>
          <Typography>KYC rejected. Please update.</Typography>
          <Button onClick={() => navigate("/profile")}>For More</Button>
        </DialogContent>
      </Dialog>
    </>
  );
};

const App = () => <TaskManager />;

export default App;
