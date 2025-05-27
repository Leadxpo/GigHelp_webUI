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
} from "@mui/material";
import axios from "axios";
import Footer from "../../Components/Footer/Footer";

const TaskManager = () => {
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
        const res = await axios.get(
          "http://localhost:3001/categories/get-all",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setCategoryList(res.data.data);
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
        const res = await axios.get(
          `http://localhost:3001/subcategories/get-all-categoryId?categoryId=${category}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setSubCategoryList(res.data.data);
      } catch (error) {
        console.error("Error fetching subcategories:", error);
      }
    };
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

      try {
        const response = await axios.get("http://localhost:3001/user/all-user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          setUsers(response.data.data); // assuming the users are in `data`
          console.log("==========>",users)
        } else {
          console.error("Failed to fetch users");
        }
      } catch (error) {
        console.error("Error fetching users:", error.response?.data || error.message);
      }
    };

    fetchAllUsers();
  }, []);














const handleSubmit = async () => {
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

    const response = await axios.post(
      "http://localhost:3001/task/create",
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (response.data.success) {
      alert(response.data.message);
      resetForm();
    }
  } catch (error) {
    console.error("Error submitting task:", error);
    alert("An error occurred while creating the task");
  }
};


  return (
    <>
      <Box sx={{ p: 3, bgcolor: "#FFFFFF", minHeight: "100vh" }}>
        <Typography variant="h4" align="center" fontWeight="bold" mb={3} mt={3}>
          Add Tasks
        </Typography>

        <Box
          sx={{
            maxWidth: "90%",
            mx: "auto",
            p: 3,
            bgcolor: "white",
            borderRadius: 2,
            boxShadow: 3,
          }}
        >
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
              {categoryList.map((cat) => (
                <MenuItem key={cat.categoryId} value={cat.categoryId}>
                  {cat.categoryName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

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
          {categoryName.toLowerCase() === "transport" && (
            <>
              <TextField
                fullWidth
                label="From"
                type="text"
                variant="outlined"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                sx={{ mb: 2 }}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                fullWidth
                label="To"
                type="text"
                variant="outlined"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                sx={{ mb: 2 }}
                InputLabelProps={{ shrink: true }}
              />
            </>
          )}

          {/* <TextField
            fullWidth
            label="Posted In"
            type="date"
            variant="outlined"
            value={postedIn}
            onChange={(e) => setPostedIn(e.target.value)}
            sx={{ mb: 2 }}
            InputLabelProps={{ shrink: true }}
          /> */}
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

          <TextField
            fullWidth
            label="Amount"
            type="number"
            variant="outlined"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Phone Number"
            variant="outlined"
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            sx={{ mb: 2 }}
          />

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

          {/* File Upload */}
          <Typography variant="h6" fontWeight="bold" mt={3} mb={1}>
            Upload Files
          </Typography>

          <Box
            sx={{
              border: "2px dashed #ccc",
              borderRadius: 2,
              p: 3,
              textAlign: "center",
              backgroundColor: "#f9f9f9",
              cursor: "pointer",
              mb: 2,
              height: 150,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
            onClick={() => document.getElementById("fileUpload").click()}
          >
            <Typography variant="body1" sx={{ fontSize: 18, mb: 1 }}>
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

          <Typography variant="body2" color="textSecondary">
            {files.length > 0
              ? `${files.length} file(s) selected`
              : "No files selected"}
          </Typography>

          {/* Submit Button */}
          <Box mt={6} align="center">
            <Button
              variant="contained"
              color="primary"
              sx={{ fontSize: "30px", fontWeight: "bold", px: 4, py: 1.5 }}
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </Box>
        </Box>
      </Box>
      <div>
        <Footer />
      </div>
    </>
  );
};

const App = () => <TaskManager />;

export default App;
