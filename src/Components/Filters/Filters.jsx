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
  Slider,
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
          maxWidth: {
            xs: "100%", // Full width on extra-small screens
            sm: "95%", // 95% width on small screens
            md: "90%", // 90% on medium screens
            lg: 1200, // Fixed max width on large screens
          },
          mx: "auto", 
          mt: { xs: 4, sm: 6, md: 8, lg: 10 }, 
          px: { xs: 2, sm: 3, md: 4 }, 
          py: { xs: 2, sm: 3 },
          borderRadius: 3,
          backgroundColor: "#fff",
          boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
        }}
      >
        <TextField
          fullWidth
          placeholder="Search"
          variant="outlined"
          sx={{
            backgroundColor: "#f5f5f5",
            borderRadius: 2,
            mb: { xs: 2, sm: 3 }, 
            fontSize: { xs: "0.9rem", sm: "1rem" },
            "& .MuiInputBase-root": {
              // py: { xs: 1, sm: 1.5 },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
              </InputAdornment>
            ),
          }}
        />

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: { xs: 2, sm: 3, md: 4, lg: 5 },
            mt: 3,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <FormControlLabel
            control={
              <Checkbox
                sx={{
                  transform: {
                    xs: "scale(1.2)",
                    sm: "scale(1.4)",
                    md: "scale(1.5)",
                  },
                }}
                checked={selectedFilter === "category"}
                onChange={() => handleFilterChange("category")}
              />
            }
            label={
              <Typography
                sx={{
                  fontSize: { xs: 16, sm: 18, md: 20, lg: 24 },
                  fontWeight: "bold",
                }}
              >
                Category
              </Typography>
            }
          />

          <FormControlLabel
            control={
              <Checkbox
                sx={{
                  transform: {
                    xs: "scale(1.2)",
                    sm: "scale(1.4)",
                    md: "scale(1.5)",
                  },
                }}
                checked={selectedFilter === "subCategory"}
                onChange={() => handleFilterChange("subCategory")}
              />
            }
            label={
              <Typography
                sx={{
                  fontSize: { xs: 16, sm: 18, md: 20, lg: 24 },
                  fontWeight: "bold",
                }}
              >
                Sub Category
              </Typography>
            }
          />

          <FormControlLabel
            control={
              <Checkbox
                sx={{
                  transform: {
                    xs: "scale(1.2)",
                    sm: "scale(1.4)",
                    md: "scale(1.5)",
                  },
                }}
                checked={selectedFilter === "budget"}
                onChange={() => handleFilterChange("budget")}
              />
            }
            label={
              <Typography
                sx={{
                  fontSize: { xs: 16, sm: 18, md: 20, lg: 24 },
                  fontWeight: "bold",
                }}
              >
                Budget
              </Typography>
            }
          />

          <FormControlLabel
            control={
              <Checkbox
                sx={{
                  transform: {
                    xs: "scale(1.2)",
                    sm: "scale(1.4)",
                    md: "scale(1.5)",
                  },
                }}
                checked={selectedFilter === "location"}
                onChange={() => handleFilterChange("location")}
              />
            }
            label={
              <Typography
                sx={{
                  fontSize: { xs: 16, sm: 18, md: 20, lg: 24 },
                  fontWeight: "bold",
                }}
              >
                Location
              </Typography>
            }
          />
        </Box>

        {selectedFilter === "category" && (
          <Paper
            sx={{
              mt: 3,
              p: { xs: 2, sm: 3, md: 4 },
              borderRadius: 3,
              boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
              border: "2px solid #007BFF",
            }}
          >
            <Typography
              variant="h6"
              fontWeight="bold"
              gutterBottom
              sx={{ fontSize: { xs: "1rem", sm: "1.2rem", md: "1.25rem" } }}
            >
              Select a Category
            </Typography>

            {loading ? (
              <Typography>Loading categories...</Typography>
            ) : categories.length === 0 ? (
              <Typography>No categories found.</Typography>
            ) : (
              <Grid container spacing={{ xs: 2, sm: 3 }}>
                {categories.map((category, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <List>
                      <ListItem
                        button
                        onClick={() => {
                          setSelectedCategory(category.categoryName);
                          navigate("/dashboard/home", {
                            state: { selectedCategory: category.categoryName },
                          });
                        }}
                        sx={{
                          borderRadius: 2,
                          "&:hover": {
                            backgroundColor: "#e3f2fd",
                          },
                        }}
                      >
                        <ListItemIcon>
                          <Radio
                            checked={selectedCategory === category.categoryName}
                            sx={{ color: "#007BFF" }}
                          />
                        </ListItemIcon>
                        <ListItemText
                          primary={category.categoryName}
                          sx={{
                            ml: 1,
                            fontWeight: "bold",
                            fontSize: { xs: "0.9rem", sm: "1rem" },
                          }}
                        />
                      </ListItem>
                    </List>
                  </Grid>
                ))}
              </Grid>
            )}
          </Paper>
        )}

        {selectedFilter === "subCategory" && (
          <Paper
            sx={{
              mt: 3,
              p: { xs: 2, sm: 3, md: 4 },
              borderRadius: 3,
              boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
              border: "2px solid #007BFF",
            }}
          >
            <Typography
              variant="h6"
              fontWeight="bold"
              gutterBottom
              sx={{ fontSize: { xs: "1rem", sm: "1.2rem", md: "1.25rem" } }}
            >
              Select a Sub Category
            </Typography>

            {loading ? (
              <Typography>Loading sub categories...</Typography>
            ) : subCategories.length === 0 ? (
              <Typography>No sub categories found.</Typography>
            ) : (
              <Grid container spacing={{ xs: 2, sm: 3 }}>
                {subCategories.map((category, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <List>
                      <ListItem
                        button
                        onClick={() => {
                          setSelectedSubCategory(category.SubCategoryName);
                          navigate("/dashboard/home", {
                            state: {
                              selectedSubCategory: category.SubCategoryName,
                            },
                          });
                        }}
                        sx={{
                          borderRadius: 2,
                          "&:hover": {
                            backgroundColor: "#e3f2fd",
                          },
                        }}
                      >
                        <ListItemIcon>
                          <Radio
                            checked={
                              selectedSubCategory === category.SubCategoryName
                            }
                            sx={{ color: "#007BFF" }}
                          />
                        </ListItemIcon>
                        <ListItemText
                          primary={category.SubCategoryName}
                          sx={{
                            ml: 1,
                            fontWeight: "bold",
                            fontSize: { xs: "0.9rem", sm: "1rem" },
                          }}
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
              p: { xs: 2, sm: 3, md: 4 },
              borderRadius: 3,
              border: "2px solid #007BFF",
              boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
              textAlign: "center",
            }}
          >
            <Typography
              variant="h6"
              fontWeight="bold"
              sx={{ fontSize: { xs: "1rem", sm: "1.2rem", md: "1.25rem" } }}
            >
              Budget Progress
            </Typography>

            <Box
              sx={{
                display: "flex",
                // flexDirection: { xs: "column", sm: "row" },
                alignItems: "center",
                justifyContent: "center",
                mt: 3,
                gap: 2,
              }}
            >
              <Slider
                value={value}
                onChange={handleSliderChange}
                min={0}
                max={maxBudget}
                step={1000}
                valueLabelDisplay="auto"
                sx={{
                  width: { xs: "100%", sm: "85%" },
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
              <Typography
                variant="body1"
                sx={{
                  fontWeight: "bold",
                  minWidth: 60,
                  textAlign: "center",
                }}
              >
                {Math.round(percentage)}%
              </Typography>
            </Box>

            <Typography
              variant="h5"
              fontWeight="bold"
              sx={{
                mt: 2,
                fontSize: { xs: "1.2rem", sm: "1.5rem" },
              }}
            >
              ₹{value.toLocaleString("en-IN")} /-
            </Typography>

            <Button
              variant="contained"
              onClick={() =>
                navigate("/dashboard/home", {
                  state: { budget: value },
                })
              }
              sx={{
                mt: 2,
                fontWeight: "bold",
                px: 4,
                py: 1,
                fontSize: { xs: "0.9rem", sm: "1rem" },
              }}
            >
              Set Budget
            </Button>
          </Paper>
        )}

        {selectedFilter === "location" && (
          <Paper
            sx={{
              mt: 3,
              p: { xs: 2, sm: 3, md: 4 },
              borderRadius: 3,
              border: "2px solid #007BFF",
              boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
              textAlign: "center",
            }}
          >
            <Typography
              variant="h6"
              fontWeight="bold"
              gutterBottom
              sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}
            >
              Location Range
            </Typography>

            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: 2,
                mb: 3,
              }}
            >
              <TextField
                fullWidth
                label="From:"
                variant="filled"
                value={fromLocation}
                onChange={(e) => setFromLocation(e.target.value)}
                sx={{
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
            </Box>

            <Button
              variant="contained"
              sx={{
                mt: 2,
                px: 4,
                py: 1,
                fontWeight: "bold",
                fontSize: { xs: "0.9rem", sm: "1rem" },
              }}
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
