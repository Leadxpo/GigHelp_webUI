import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  InputAdornment,
  Checkbox,
  FormControlLabel,
  Grid,
  Typography,
  Paper,
  Radio,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
Button,
  Slider
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Footer from "../../Components/Footer/Footer";


export default function FilterSection() {
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  const [loading, setLoading] = useState(true);

  const [fromLocation, setFromLocation] = useState("");
const [toLocation, setToLocation] = useState("");


  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
          "http://localhost:3001/categories/get-all",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("Fetched categories response:", response.data);

        // Set the actual array inside `data`
        setCategories(response.data.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);


useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
          "http://localhost:3001/subcategories/get-all",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("Fetched sub categories response:", response.data);

        // Set the actual array inside `data`
        setSubCategories(response.data.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);






  const handleFilterChange = (filter) => {
    setSelectedFilter(selectedFilter === filter ? null : filter);
  };


 const [value, setValue] = useState(0);
  const maxBudget = 500000;

  const handleSliderChange = (event, newValue) => {
    setValue(newValue);
  };

  const percentage = (value / maxBudget) * 100;

  return (
      <>
    <Box
      sx={{
        maxWidth: 1200,
        mx: "auto",
        mt: 10,
        px: 3,
        py: 3,
        borderRadius: 3,
        backgroundColor: "#fff",
        boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
      }}
    >
      {/* Search Bar */}
      <TextField
        fullWidth
        placeholder="Search"
        variant="outlined"
        sx={{ backgroundColor: "#f5f5f5", borderRadius: 2 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />

      {/* Filters */}
      <Box
        sx={{
          display: "flex",
          gap: 5,
          mt: 3,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <FormControlLabel
          control={
            <Checkbox
              sx={{ transform: "scale(1.5)" }}
              checked={selectedFilter === "category"}
              onChange={() => handleFilterChange("category")}
            />
          }
          label={
            <Typography sx={{ fontSize: 24, fontWeight: "bold" }}>
              Category
            </Typography>
          }
        />

 <FormControlLabel
          control={
            <Checkbox
              sx={{ transform: "scale(1.5)" }}
              checked={selectedFilter === "subCategory"}
              onChange={() => handleFilterChange("subCategory")}
            />
          }
          label={
            <Typography sx={{ fontSize: 24, fontWeight: "bold" }}>
           Sub Category
            </Typography>
          }
        />


        <FormControlLabel
          control={
            <Checkbox
              sx={{ transform: "scale(1.5)" }}
              checked={selectedFilter === "budget"}
              onChange={() => handleFilterChange("budget")}
            />
          }
          label={
            <Typography sx={{ fontSize: 24, fontWeight: "bold" }}>
              Budget
            </Typography>
          }
        />
        <FormControlLabel
          control={
            <Checkbox
              sx={{ transform: "scale(1.5)" }}
              checked={selectedFilter === "location"}
              onChange={() => handleFilterChange("location")}
            />
          }
          label={
            <Typography sx={{ fontSize: 24, fontWeight: "bold" }}>
              Location
            </Typography>
          }
        />
      </Box>

      {/* Category Filter Content */}
      {selectedFilter === "category" && (
        <Paper
          sx={{
            mt: 3,
            p: 4,
            borderRadius: 3,
            boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
            border: "2px solid #007BFF",
          }}
        >
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Select a Category
          </Typography>

          {loading ? (
            <Typography>Loading categories...</Typography>
          ) : categories.length === 0 ? (
            <Typography>No categories found.</Typography>
          ) : (
            <Grid container spacing={3}>
              {categories.map((category, index) => (
                <Grid item xs={6} key={index}>
                  <List>
                    <ListItem
                      button
                      onClick={() => {
                        setSelectedCategory(category.categoryName);
                        navigate("/dashboard/home", {
                          state: { selectedCategory: category.categoryName },
                        });
                      }}
                    >
                      <ListItemIcon>
                        <Radio
                          checked={selectedCategory === category.categoryName}
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={category.categoryName}
                        sx={{ ml: 1, fontWeight: "bold" }}
                      />
                    </ListItem>
                  </List>
                </Grid>
              ))}
            </Grid>
          )}
        </Paper>
      )}


 {/* Sub Category Filter Content */}
      {selectedFilter === "subCategory" && (
        <Paper
          sx={{
            mt: 3,
            p: 4,
            borderRadius: 3,
            boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
            border: "2px solid #007BFF",
          }}
        >
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Select a sub Category
          </Typography>

          {loading ? (
            <Typography>Loading sub categories...</Typography>
          ) : subCategories.length === 0 ? (
            <Typography>No categories found.</Typography>
          ) : (
            <Grid container spacing={3}>
              {subCategories.map((category, index) => (
                <Grid item xs={6} key={index}>
                  <List>
                    <ListItem
                      button
                      onClick={() => {
                        setSelectedSubCategory(category.SubCategoryName);
                        navigate("/dashboard/home", {
                          state: { selectedSubCategory: category.SubCategoryName },
                        });
                      }}
                    >
                      <ListItemIcon>
                        <Radio
                          checked={selectedSubCategory === category.SubCategoryName}
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={category.SubCategoryName}
                        sx={{ ml: 1, fontWeight: "bold" }}
                      />
                    </ListItem>
                  </List>
                </Grid>
              ))}
            </Grid>
          )}
        </Paper>
      )}









   {selectedFilter === "budget" && (
 <Paper
      sx={{
        mt: 3,
        p: 4,
        borderRadius: 3,
        border: "2px solid #007BFF",
        boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
        textAlign: "center",
      }}
    >
      <Typography variant="h6" fontWeight="bold">
        Budget Progress
      </Typography>

      <Box sx={{ display: "flex", alignItems: "center", mt: 3 }}>
        <Slider
          value={value}
          onChange={handleSliderChange}
          min={0}
          max={maxBudget}
          step={1000}
          valueLabelDisplay="auto"
          sx={{
            width: "85%",
            height: 12,
            color: "#007BFF",
            "& .MuiSlider-thumb": {
              borderRadius: 2,
            },
            "& .MuiSlider-track": {
              borderRadius: 3,
            },
            "& .MuiSlider-rail": {
              backgroundColor: "#E0E0E0",
              borderRadius: 3,
            },
          }}
        />
        <Typography variant="body1" sx={{ ml: 2, fontWeight: "bold" }}>
          {Math.round(percentage)}%
        </Typography>


      </Box>

      <Typography variant="h5" fontWeight="bold" sx={{ mt: 2 }}>
        ₹{value.toLocaleString("en-IN")} /-
      </Typography>

        <Button variant="contained" justifyContent="end" 
         onClick={() => {
                        // setSelectedCategory(category.categoryName);
                        navigate("/dashboard/home", {
                          state: { budget: value},
                        });
                      }}
        >
          Set Budget
        </Button>
    </Paper>

   )}


      {/* Location Filter Content */}
      {selectedFilter === "location" && (
        <Paper
          sx={{
            mt: 3,
            p: 4,
            borderRadius: 3,
            border: "2px solid #007BFF",
            boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
            textAlign: "center",
          }}
        >
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Location Range
          </Typography>
          <TextField
  fullWidth
  label="From:"
  variant="filled"
  value={fromLocation}
  onChange={(e) => setFromLocation(e.target.value)}
  sx={{
    mb: 3,
    backgroundColor: "#f5f5f5",
    borderRadius: 2,
    "& .MuiInputBase-root": { borderRadius: 2 },
  }}
/>

<TextField
  fullWidth
  label="To:"
  variant="filled"
  value={toLocation}
  onChange={(e) => setToLocation(e.target.value)}
  sx={{
    backgroundColor: "#f5f5f5",
    borderRadius: 2,
    "& .MuiInputBase-root": { borderRadius: 2 },
  }}
/>

 <Button
  variant="contained"
  sx={{ mt: 2 }}
  onClick={() => {
    navigate("/dashboard/home", {
      state: {
        category: "Transport",
        from: fromLocation,
        to: toLocation,
      },
    });
  }}
>
  Search
</Button>

        </Paper>
      )}




    </Box>
       <div>
        <Footer />
      </div>
    </>
  );
}
