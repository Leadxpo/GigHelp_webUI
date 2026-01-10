import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../Components/NavbarComponent/Navbar";
import Sidebar from "../Components/SidebarComponent/sidebar";
import { Box, useMediaQuery, useTheme, Backdrop } from "@mui/material";

const Layout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [openSidebar, setOpenSidebar] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUserData(storedUser);
  }, []);

  const toggleSidebar = () => {
    // Only toggle if user is logged in
    if (userData) {
      setOpenSidebar((prev) => !prev);
    }
  };

  const sidebarWidth = 260;

  return (
    <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      {/* Sidebar - Only show if user logged in */}
      {userData && (
        <Box
          sx={{
            width: openSidebar ? (isMobile ? "260px" : "260px") : "0px",
            position: isMobile ? "fixed" : "relative",
            zIndex: isMobile ? 1300 : 1,
            height: "100vh",
            backgroundColor: "#fff",
            left: 0,
            transition: "all 0.3s ease",
            overflowX: "hidden",
            boxShadow:
              openSidebar && isMobile ? "2px 0px 8px rgba(0,0,0,0.4)" : "none",
            pt: !isMobile ? "100px" : 0,
          }}
        >
          <Sidebar isOpen={openSidebar} />
        </Box>
      )}

      {/* Backdrop for mobile */}
      {isMobile && openSidebar && userData && (
        <Backdrop
          open
          onClick={toggleSidebar}
          sx={{
            zIndex: 1200,
            position: "fixed",
            backgroundColor: "rgba(0, 0, 0, 0.3)",
          }}
        />
      )}

      {/* Main Content + Navbar */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          width: "100%",
          transition: "margin-left 0.3s ease-in-out",
        }}
      >
        {/* Navbar */}
        <Box
          sx={{
            position: "fixed",
            width: "100%",
            zIndex: 1100,
          }}
        >
          <Navbar
            toggleSidebar={toggleSidebar}
            hideMenuIcon={!userData} // Hide hamburger if not logged in
          />
        </Box>

        {/* Page Content */}
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            mt: { xs: 12, sm: 12 },
            height: "100vh",
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;

// import { useState } from "react";
// import { Outlet, useLocation } from "react-router-dom";
// import Navbar from "../Components/NavbarComponent/Navbar";
// import Sidebar from "../Components/SidebarComponent/sidebar";
// import { Box ,useMediaQuery, useTheme,} from "@mui/material";

// const Layout = () => {
//   const location = useLocation();
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
//   const [openSidebar, setOpenSidebar] = useState(false); // Default sidebar hidden

//   const toggleSidebar = () => {
//     setOpenSidebar(!openSidebar);
//   };

//   return (
//     <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
//       {/* Sidebar */}
//       <div
//         style={{
//           flex: 1,
//           width: openSidebar ? "260px" : "0px",
//           transition: "width 0.3s ease-in-out",
//           position: "fixed",
//           zIndex: 1000,
//           zIndex: isMobile ? 1300 : 1,
//           marginTop: 100,
//           height: "100vh",
//           // overflowY: "auto", // Enable scrolling inside sidebar
//           backgroundColor: "#fff",
//           left: 0, // Ensures sidebar stays on the left
//           overflowX: "hidden", // Prevents horizontal scrolling
//           boxShadow: openSidebar ? "2px 0px 8px rgba(0,0,0,0.2)" : "none",
//         }}
//       >
//         <Sidebar isOpen={openSidebar} />
//       </div>

//       {/* Navbar and Main Content */}
//       <div
//         style={{
//           flex: 1,
//           transition: "margin-left 0.3s ease-in-out",
//           // marginLeft: openSidebar ? "260px" : "0",
//           width: "100%",
//           display: "flex",
//           flexDirection: "column",
//           height: "100vh",
//           overflowX: "hidden", // Ensures no horizontal scrolling
//         }}
//       >
//         {/* Navbar - Fixed at Top */}
//         <div style={{ position: "fixed", width: "100%", zIndex: 1000 }}>
//           <Navbar toggleSidebar={toggleSidebar} hideMenuIcon={openSidebar} />
//         </div>

//         {/* Main Content - Scrollable */}
//         <div
//           style={{
//             flex: 1,
//             overflowY: "auto", // Enables vertical scrolling
//             padding: "2px",
//             // marginTop: "60px", // Adjust for navbar height
//             height: "100vh",
//             overflowX: "hidden", // Prevents horizontal scrolling on content
//           }}
//         >
//           <Box mt={12}>
//             {" "}
//             {/* ✅ Margin Top 2 (theme spacing unit) */}
//             <Outlet />
//           </Box>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Layout;
