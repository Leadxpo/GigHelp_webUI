import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../Components/NavbarComponent/Navbar";
import Sidebar from "../Components/SidebarComponent/sidebar";
import { Box, } from "@mui/material";


const Layout = () => {
  const location = useLocation();
  const [openSidebar, setOpenSidebar] = useState(false); // Default sidebar hidden

  const toggleSidebar = () => {
    setOpenSidebar(!openSidebar);
  };

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      {/* Sidebar */}
      <div
        style={{
          width: openSidebar ? "260px" : "0px",
          transition: "width 0.3s ease-in-out",
          position: "fixed",
          zIndex: 1000,
          height: "100vh",
          // overflowY: "auto", // Enable scrolling inside sidebar
          backgroundColor: "#fff",
          left: 0, // Ensures sidebar stays on the left
          overflowX: "hidden", // Prevents horizontal scrolling
        }}
      >
        <Sidebar isOpen={openSidebar} />
      </div>

      {/* Navbar and Main Content */}
      <div
        style={{
          flex: 1,
          transition: "margin-left 0.3s ease-in-out",
          marginLeft: openSidebar ? "260px" : "0",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          overflowX: "hidden", // Ensures no horizontal scrolling
        }}
      >
        {/* Navbar - Fixed at Top */}
        <div style={{ position: "fixed", width: "100%", zIndex: 1000 }}>
          <Navbar toggleSidebar={toggleSidebar} hideMenuIcon={openSidebar} />
        </div>

        {/* Main Content - Scrollable */}
        <div
          style={{
            flex: 1,
            overflowY: "auto", // Enables vertical scrolling
            padding: "2px",
            // marginTop: "60px", // Adjust for navbar height
            height: "100vh",
            overflowX: "hidden", // Prevents horizontal scrolling on content
          }}
        >
           <Box mt={12}> {/* ✅ Margin Top 2 (theme spacing unit) */}
      <Outlet />
    </Box>
        </div>
      </div>
    </div>
  );
};

export default Layout;
