import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";

// Import all pages
import EmailLogin from "./Components/LoginComponent/EmailLogin";
import PhoneLogin from "./Components/LoginComponent/PhoneLogin";
import OTPLogin from "./Components/LoginComponent/otpSend";
import RegisterForm from "./Components/LoginComponent/RegisterForm";
import LoginPage from "./Pages/Login";
import HomePage from "./Pages/Homepage";
import AddTask from "./Pages/Addtaskpage";
import AllTasks from "./Pages/Alltaskspage";
import MyTasks from "./Pages/Mytaskspage";
import MyBids from "./Pages/MyBids";
import Fillters from "./Pages/Fillters";
import Profile from "./Pages/Profile";
import AppSettings from "./Pages/settings";
import Transactions from "./Pages/Transactions";
import HelpSupport from "./Pages/help&support";
import Layout from "./Pages/Layout";
import Logout from "./Pages/Logout";
import Notification from "./Pages/Notification";
import TermsAndConditions from "./Pages/termsAndCondition";



const PrivateRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("token");
  return isAuthenticated ? children : <Navigate to="/" />;
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem("token", "userToken"); // Mock token for demo purposes
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("token");
  };

  return (
    <Router>
      <Routes>
        {/* Login & Authentication Routes */}
        <Route path="/" element={<LoginPage onLogin={handleLogin} />} />
        <Route path="/email-login" element={<EmailLogin />} />
        <Route path="/phone-login" element={<PhoneLogin />} />
        <Route path="/otp-login" element={<OTPLogin />} />
        <Route path="/register-form" element={<RegisterForm />} />


        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route index element={<HomePage />} />
          <Route path="home" element={<HomePage />} />
          <Route path="add-task" element={<AddTask />} />
          <Route path="all-tasks" element={<AllTasks />} />
          <Route path="my-tasks" element={<MyTasks />} />
          <Route path="my-bids" element={<MyBids />} />
          <Route path="filters" element={<Fillters />} />
          <Route path="profile" element={<Profile />} />
          <Route path="notification" element={<Notification />} />
          <Route path="app-settings" element={<AppSettings />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="help-support" element={<HelpSupport />} />
          <Route path="terms-conditions" element={<TermsAndConditions />} />

          <Route path="logout" element={<Logout onLogout={handleLogout} />} />
          <Route path="*" element={<Navigate to="/dashboard/home" />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
