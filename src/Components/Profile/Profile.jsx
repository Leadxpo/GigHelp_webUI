import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  IconButton,
  Stack,
  Typography,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  TextField,
} from "@mui/material";
import {
  Edit,
  Email,
  LocationOn,
  Person,
  Phone,
  AccountCircle, // for accountHolder
  CreditCard, // for accountNumber
  AccountBalance, // for bankName
  Numbers, // for IFSC Code
  ArrowForward,
  Fullscreen,
} from "@mui/icons-material";
import UploadIcon from "@mui/icons-material/Upload";

const ProfilePage = () => {
  const [userData, setUserData] = useState(
    () => JSON.parse(localStorage.getItem("user")) || {}
  );
  const fileInputRef = useRef(null);

  const [totalTasks, setTotalTasks] = useState(0);
  const [disputeTasks, setDisputeTasks] = useState(0);
  const [completedTasks, setCompletedTasks] = useState(0);
  const [totalBids, setTotalBids] = useState(0);
  const [completedBids, setCompletedBids] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [selectedProofFile, setSelectedProofFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [profileData, setProfileData] = useState({
    userName: userData?.userName || "",
    email: userData?.email || "",
    phoneNumber: userData?.phoneNumber || "",
    address: userData?.address || "",

    accountHolder: userData?.accountHolder || "",
    accountNumber: userData?.accountNumber || "",
    bankName: userData?.bankName || "",
    ifscCode: userData?.ifscCode || "",

    skills: userData?.skills || [], // ← Add this line
  });

  const handleEditToggle = () => {
    setIsEditing(true);
    setUpdateSuccess(false); // Allow editing again
  };

  useEffect(() => {
    if (userData?.identityProof) {
      setPreviewUrl(`http://localhost:3001/uploads/${userData.identityProof}`);
    }
  }, [userData]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImageFile(file);

      // Optional preview (immediate change on UI before upload)
      const previewUrl = URL.createObjectURL(file);
      setUserData((prev) => ({
        ...prev,
        profilePic: previewUrl,
      }));
    }
  };

  const handleRemovePhoto = () => {
    setSelectedImageFile(null);
    setUserData((prev) => ({
      ...prev,
      profilePic: "", // clear the preview
    }));
  };

  // Function to handle image file selection
  const handleChangePhotoClick = () => {
    fileInputRef.current.click();
  };

  useEffect(() => {
    const fetchTaskStats = async () => {
      try {
        const userId = userData.userId;
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
  }, [userData.userId]);

  useEffect(() => {
    const fetchBidStats = async () => {
      try {
        const userId = userData.userId;
        const token = localStorage.getItem("token");
        if (!userId || !token) return;

        const res = await axios.get(
          `http://localhost:3001/Bids/count/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const { totalBids, completedBids } = res.data?.data || {};
        setTotalBids(totalBids || 0);
        setCompletedBids(completedBids || 0);
      } catch (error) {
        console.error("Error fetching bid stats:", error);
      }
    };

    fetchBidStats();
  }, [userData.userId]);

  const handleUpdateProfile = async () => {
    const token = localStorage.getItem("token");

    try {
      const formData = new FormData();
      formData.append("userName", profileData.userName);
      formData.append("email", profileData.email);
      formData.append("phoneNumber", profileData.phoneNumber);
      formData.append("address", profileData.address);
      formData.append("accountHolder", profileData.accountHolder);
      formData.append("accountNumber", profileData.accountNumber);
      formData.append("bankName", profileData.bankName);
      formData.append("ifscCode", profileData.ifscCode);

      if (selectedImageFile) {
        formData.append("profilePic", selectedImageFile);
      }

      if (selectedProofFile && selectedProofFile.length > 0) {
        selectedProofFile.forEach((file) => {
          formData.append("identityProof", file); // multiple files with same field name
        });
      }

      const res = await axios.put(
        `http://localhost:3001/user/user-update/${userData.userId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      localStorage.setItem("user", JSON.stringify(res.data.data));
      setUserData(res.data.data);
      setIsEditing(false);
      setUpdateSuccess(true);
      alert("Profile updated successfully");
      window.location.reload();
    } catch (err) {
      console.error("Update Error:", err.response?.data || err.message);
      alert("Failed to update profile");
    }
  };

  const handleProofUpload = (e) => {
    const files = Array.from(e.target.files);
    setSelectedProofFile(files); // Store array of files
  };



  let identityProofArray = [];

  try {
    identityProofArray = Array.isArray(userData.identityProof)
      ? userData.identityProof
      : JSON.parse(userData.identityProof);
  } catch (error) {
    console.error("Failed to parse identityProof", error);
  }

  return (
    <Box p={4}>
      {/* Header Section */}
      <Typography variant="h4" fontWeight="bold" textAlign="center" mb={4}>
        Profile Details
      </Typography>
      {/* Hidden File Input */}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />

      {/* Profile Picture Section */}
      <Grid container justifyContent="left" alignItems="left" spacing={4}>
        <Grid item>
          <Avatar
            src={
              selectedImageFile
                ? URL.createObjectURL(selectedImageFile)
                : userData?.profilePic?.startsWith("blob:") // local preview case
                ? userData.profilePic
                : userData?.profilePic
                ? `http://localhost:3001/storege/userdp/${userData.profilePic}`
                : ""
            }
            sx={{
              width: 150,
              height: 150,
              border: "4px solid #1B88CA",
              boxShadow: 4,
            }}
          />
        </Grid>
        <Grid item>
          <Typography variant="h5" fontWeight="bold" mb={2}>
            {userData?.userName || "Your Name"}
          </Typography>

          <Stack direction="row" spacing={2}>
            <Button variant="outlined" onClick={handleChangePhotoClick}>
              Change Photo
            </Button>

            

            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                border: "1px solid",
                borderColor:
                  userData?.status === "Pending"
                    ? "orange"
                    : userData?.status === "Approved"
                    ? "green"
                    : userData?.status === "rejected"
                    ? "red"
                    : "gray",
                borderRadius: "8px",
                px: 2,
                py: 1,
                backgroundColor:
                  userData?.status === "Pending"
                    ? "rgba(255,165,0,0.1)"
                    : userData?.status === "approved"
                    ? "rgba(0,128,0,0.1)"
                    : userData?.status === "rejected"
                    ? "rgba(255,0,0,0.1)"
                    : "transparent",
              }}
            >
              <Typography
                variant="subtitle1"
                fontWeight="bold"
                sx={{ color: "blue", mr: 1 }}
              >
                KYC:
              </Typography>
              <Typography
                variant="subtitle1"
                fontWeight="bold"
                sx={{
                  color:
                    userData?.status === "Pending"
                      ? "orange"
                      : userData?.status === "Approved"
                      ? "green"
                      : userData?.status === "Rejected"
                      ? "red"
                      : "black",
                }}
              >
                {userData?.status}
              </Typography>
            </Box>

          </Stack>
            <Box
              sx={{
                border: "1px solid red",
                borderRadius: "8px",
                alignSelf: "flex-end",
                padding: 1,
                marginTop: 2,
                maxWidth: "600px",
                maxHeight: "100px",
                overflowY: "auto",
                whiteSpace: "pre-wrap",
                backgroundColor: "#ffe6e6", // light red background
              }}
            >
              <Typography
                variant="subtitle1"
                fontWeight="bold"
                color="red"
                mb={1}
              >
                Remarks:
              </Typography>
              <Typography
                variant="body2"
                color="red"
                sx={{ textAlign: "justify" }}
              >
                {userData?.remarks || "No remarks available."}
              </Typography>
            </Box>

          {/* <IconButton onClick={handleEditToggle}>
            <Edit />
          </IconButton> */}

          {isEditing && (
            <Box mt={3} textAlign="center">
              {isEditing && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleUpdateProfile}
                >
                  Update
                </Button>
              )}
            </Box>
          )}
        </Grid>
      </Grid>

      {/* Profile Details Card */}
      <Card
        sx={{
          mt: 5,
          p: 3,
          borderRadius: 3,
          boxShadow: 3,
          maxWidth: 1500,
          mx: "auto",
        }}
      >
        <CardContent>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={4}
          >
            <Typography variant="h6" fontWeight="bold">
              Profile Details
            </Typography>
            <IconButton onClick={handleEditToggle}>
              <Edit />
            </IconButton>
          </Box>

          <Grid
            container
            justifyContent="space-between"
            alignItems="flex-start"
          >
            <Grid item xs={12} sm={10}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={6}>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Person sx={{ color: "#1B88CA" }} />
                    {isEditing ? (
                      <TextField
                        size="small"
                        value={profileData.userName}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            userName: e.target.value,
                          })
                        }
                      />
                    ) : (
                      <Typography fontWeight="500">
                        {profileData.userName}
                      </Typography>
                    )}
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Email sx={{ color: "#1B88CA" }} />
                    {isEditing ? (
                      <TextField
                        size="small"
                        value={profileData.email}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            email: e.target.value,
                          })
                        }
                      />
                    ) : (
                      <Typography>{profileData.email}</Typography>
                    )}
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Phone sx={{ color: "#1B88CA" }} />
                    {isEditing ? (
                      <TextField
                        size="small"
                        value={profileData.phoneNumber}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            phoneNumber: e.target.value,
                          })
                        }
                      />
                    ) : (
                      <Typography>{profileData.phoneNumber}</Typography>
                    )}
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <LocationOn sx={{ color: "#1B88CA" }} />
                    {isEditing ? (
                      <TextField
                        size="small"
                        value={profileData.address}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            address: e.target.value,
                          })
                        }
                      />
                    ) : (
                      <Typography>{profileData.address}</Typography>
                    )}
                  </Stack>
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              {isEditing && (
                <Box mt={3} textAlign="center">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleUpdateProfile}
                  >
                    Update
                  </Button>
                </Box>
              )}
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card
        sx={{
          maxWidth: "100%",
          mx: "auto",
          mt: 5,
          p: 2,
          boxShadow: 3,
          borderRadius: 2,
        }}
      >
        <CardContent sx={{ textAlign: "left" }}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={4}
          >
            <Typography variant="h6" gutterBottom>
              Identity Proof
            </Typography>
            <IconButton onClick={handleEditToggle}>
              <Edit />
            </IconButton>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
            {console.log("hhhhhhhhhh", userData?.identityProff)}

            {identityProofArray && identityProofArray.length > 0 ? (
              identityProofArray.map((file, index) => (
                <img
                  key={index}
                  src={`http://localhost:3001/storege/userdp/${file}`}
                  alt={`Identity Proof ${index + 1}`}
                  style={{
                    width: 100,
                    height: 100,
                    margin: 8,
                    objectFit: "cover",
                  }}
                />
              ))
            ) : (
              <Box
                sx={{
                  width: 150,
                  height: 150,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "2px dashed #aaa",
                  color: "#888",
                }}
              >
                No Image
              </Box>
            )}
          </Box>

          <Button
            variant="contained"
            component="label"
            startIcon={<UploadIcon />}
          >
            Upload Identity Proof
            <input
              type="file"
              hidden
              accept="image/*"
              multiple
              onChange={handleProofUpload}
            />
          </Button>
        </CardContent>
      </Card>

      {/* Bank Details Card */}
      <Card
        sx={{
          mt: 5,
          p: 3,
          borderRadius: 3,
          boxShadow: 3,
          maxWidth: 1500,
          mx: "auto",
        }}
      >
        <CardContent>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={4}
          >
            <Typography variant="h6" fontWeight="bold">
              Bank Details
            </Typography>
            <IconButton onClick={handleEditToggle}>
              <Edit />
            </IconButton>
          </Box>

          <Grid
            container
            justifyContent="space-between"
            alignItems="flex-start"
          >
            <Grid item xs={12} sm={10}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={6}>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <AccountCircle sx={{ color: "#1B88CA" }} />
                    {isEditing ? (
                      <TextField
                        size="small"
                        value={profileData.accountHolder}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            accountHolder: e.target.value,
                          })
                        }
                      />
                    ) : (
                      <Typography fontWeight="500">
                        Account Holder Name: {profileData.accountHolder}
                      </Typography>
                    )}
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <CreditCard sx={{ color: "#1B88CA" }} />
                    {isEditing ? (
                      <TextField
                        size="small"
                        value={profileData.accountNumber}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            accountNumber: e.target.value,
                          })
                        }
                      />
                    ) : (
                      <Typography>
                        Account Number: {profileData.accountNumber}
                      </Typography>
                    )}
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <AccountBalance sx={{ color: "#1B88CA" }} />
                    {isEditing ? (
                      <TextField
                        size="small"
                        value={profileData.bankName}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            bankName: e.target.value,
                          })
                        }
                      />
                    ) : (
                      <Typography>Bank Name: {profileData.bankName}</Typography>
                    )}
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Numbers sx={{ color: "#1B88CA" }} />
                    {isEditing ? (
                      <TextField
                        size="small"
                        value={profileData.ifscCode}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            ifscCode: e.target.value,
                          })
                        }
                      />
                    ) : (
                      <Typography>IFSC Code: {profileData.ifscCode}</Typography>
                    )}
                  </Stack>
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              {isEditing && (
                <Box mt={3} textAlign="center">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleUpdateProfile}
                  >
                    Update
                  </Button>
                </Box>
              )}
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Skills and Experience Section */}
      <Card
        sx={{
          mt: 5,
          p: 3,
          borderRadius: 3,
          boxShadow: 3,
          maxWidth: 1500,
          mx: "auto",
        }}
      >
        <CardContent>
          <Typography variant="h6" fontWeight="bold" mb={2}>
            Skills & Experience
          </Typography>
          {Array.isArray(profileData.skills) &&
          profileData.skills.length > 0 ? (
            profileData.skills.map((skill, index) => (
              <Box
                key={index}
                mb={2}
                p={2}
                border="1px solid #ddd"
                borderRadius={2}
              >
                <Typography>
                  <strong>Work:</strong> {skill.work}
                </Typography>
                {/* <Typography>
                  <strong>Title:</strong> {skill.title}
                </Typography>
                <Typography>
                  <strong>Description:</strong> {skill.content}
                </Typography> */}
                <Typography>
                  <strong>Experience:</strong> {skill.experience}
                </Typography>
              </Box>
            ))
          ) : (
            <Typography>
              No skills or experience information available.
            </Typography>
          )}
        </CardContent>
      </Card>

      {/* Task Section */}
      <Card sx={{ p: 2, mt: 4, borderRadius: 3, boxShadow: 4 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h6" fontWeight="bold">
            My Task
          </Typography>
          <Button endIcon={<ArrowForward />} sx={{ textTransform: "none" }}>
            See more
          </Button>
        </Stack>
        <Divider />
        <Box mt={2}>
          <Typography fontWeight="500" mb={1}>
            Number of Tasks: <strong>{totalTasks}</strong>
          </Typography>
          <Typography fontWeight="500">
            Number Completed: <strong>{completedTasks}</strong>
          </Typography>
          <Typography fontWeight="500">
            In Dispute: <strong>{disputeTasks}</strong>
          </Typography>
        </Box>
      </Card>

      {/* Bids Section */}
      <Card sx={{ p: 2, mt: 4, borderRadius: 3, boxShadow: 4 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h6" fontWeight="bold">
            My Bids
          </Typography>
          <Button endIcon={<ArrowForward />} sx={{ textTransform: "none" }}>
            See more
          </Button>
        </Stack>
        <Divider />
        <Box mt={2}>
          <Typography fontWeight="500" mb={1}>
            Number of Bids: <strong>{totalBids}</strong>
          </Typography>
          <Typography fontWeight="500">
            Number Completed: <strong>{completedBids}</strong>
          </Typography>
        </Box>
      </Card>

      {/* Achievements Section */}
      <Card sx={{ p: 2, mt: 4, borderRadius: 3, boxShadow: 4 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h6" fontWeight="bold">
            Achievements
          </Typography>
          <Button endIcon={<ArrowForward />} sx={{ textTransform: "none" }}>
            See more
          </Button>
        </Stack>
        <Divider />
        <Box mt={2}>
          <Typography fontWeight="500" mb={1}>
            Number of Tasks: <strong>{profileData.experiance}</strong>
          </Typography>
          <Typography fontWeight="500">
            Number Completed: <strong>{profileData.experiance}</strong>
          </Typography>
        </Box>
      </Card>
    </Box>
  );
};

export default ProfilePage;
