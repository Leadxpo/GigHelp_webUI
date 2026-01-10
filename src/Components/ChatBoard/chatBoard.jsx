import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Typography,
  TextField,
  Paper,
  Avatar,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import SendIcon from "@mui/icons-material/Send";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import axios from "axios";

const App = (props) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [file, setFile] = useState(null);
  const [receiverId] = useState(90001);
  const chatEndRef = useRef(null);
  const [user, setUser] = useState("");
  const loginUser = JSON.parse(localStorage.getItem("user"));
  const senderId = loginUser?.userId;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const storedUser = localStorage.getItem("senderName");
    if (storedUser) setUser(Number(storedUser));
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `http://localhost:3001/chatbox/conversation/${props?.task?.taskUserId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessages(res.data.data);
    } catch (err) {
      console.error(
        "Error fetching messages:",
        err?.response?.data || err.message
      );
    }
  };

  const sendMessage = async () => {
    if (file) {
      await sendMessageFile(file, input);
    } else {
      try {
        const token = localStorage.getItem("token");
        await axios.post(
          "http://localhost:3001/chatbox/send",
          {
            senderId,
            receiverId: props?.task?.taskUserId,
            taskId: props?.task?.taskId,
            message: input,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setInput("");
        setFile(null);
        fetchMessages();
      } catch (err) {
        console.error("Error sending message:", err);
      }
    }
  };

  const sendMessageFile = async (fileToSend, textMessage = "") => {
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();

      formData.append("senderId", senderId);
      formData.append("receiverId", props?.task?.taskUserId);
      formData.append("taskId", props?.task?.taskId);
      formData.append("message", textMessage || fileToSend.name);
      formData.append("file", fileToSend);

      await axios.post("http://localhost:3001/chatbox/send", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setInput("");
      setFile(null);
      fetchMessages();
    } catch (err) {
      console.error("Error sending file message:", err);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Box
      sx={{
        maxWidth: 1500,
        mx: "auto",
        minHeight: { xs: "80vh", sm: "90vh", md: "100vh" },
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography
        variant="h6"
        align="center"
        p={2}
        bgcolor="primary.main"
        color="white"
      >
        Chat with {props?.task?.taskUserId}
      </Typography>

      <Paper
        elevation={0}
        sx={{
          flex: 1,
          overflowY: "auto",
          p: { xs: 1, sm: 2 },
          bgcolor: "#f0f0f0",
        }}
      >
        {messages.map((msg, i) => {
          const isSender = Number(msg.sender) === Number(user);
          const timestamp = new Date(msg.timestamp);
          const time = timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });

          return (
            <Box
              key={i}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems:
                  msg.senderId === senderId ? "flex-end" : "flex-start",
                mb: 2,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  maxWidth: isMobile ? "100%" : "75%",
                  bgcolor: isSender ? "#DCF8C6" : "white",
                  p: 1.5,
                  borderRadius: 3,
                  boxShadow: 1,
                  flexWrap: "wrap",
                }}
              >
                <Avatar sx={{ mr: 1 }}>{String(msg.sender)[0]}</Avatar>
                <Box>
                  <Typography variant="body2" sx={{ wordBreak: "break-word" }}>
                    {msg.message}
                  </Typography>
                  {msg.fileUrl && (
                    <Box mt={1}>
                      {msg.fileType?.startsWith("image") && (
                        <img
                          src={msg.fileUrl}
                          alt="img"
                          style={{
                            width: "100%",
                            maxWidth: 200,
                            borderRadius: 8,
                          }}
                        />
                      )}
                      {msg.fileType?.startsWith("video") && (
                        <video
                          src={msg.fileUrl}
                          controls
                          style={{ width: "100%", maxWidth: 250 }}
                        />
                      )}
                      {msg.fileType?.startsWith("application") && (
                        <a
                          href={msg.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Download File
                        </a>
                      )}
                    </Box>
                  )}
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ mt: 0.5, textAlign: "left" }}
                  >
                    {time}
                  </Typography>
                </Box>
              </Box>
            </Box>
          );
        })}
        <div ref={chatEndRef} />
      </Paper>

      <Box
        sx={{
          p: { xs: 1, sm: 2 },
          borderTop: "2px solid #ddd",
          display: "flex",
          flexDirection: { xs: "row", sm: "row" },
          alignItems: "center",
          bgcolor: "white",
          gap: 1,
        }}
      >
        <TextField
          multiline
          maxRows={4}
          fullWidth
          placeholder="Type a message"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          sx={{
            "& .MuiInputBase-root": {
              overflowY: "auto",
            },
          }}
        />
        <input
          type="file"
          id="file-input"
          hidden
          accept="image/*,application/pdf,video/*"
          onChange={handleFileChange}
        />
        <label htmlFor="file-input">
          <IconButton component="span">
            <AttachFileIcon />
          </IconButton>
        </label>
        <IconButton color="primary" onClick={sendMessage}>
          <SendIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default App;

// import React, { useEffect, useState, useRef } from "react";
// import {
//   Box,
//   Typography,
//   TextField,
//   Paper,
//   Avatar,
//   IconButton,
// } from "@mui/material";
// import SendIcon from "@mui/icons-material/Send";
// import AttachFileIcon from "@mui/icons-material/AttachFile";
// import axios from "axios";
// // bidder chat
// const App = (props) => {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");
//   const [file, setFile] = useState(null);
//   const [receiverId] = useState(90001);
//   const chatEndRef = useRef(null);
//   const [user, setUser] = useState("");
//   // const senderId = localS

//   console.log("===========task====>", props);

//   // sender means bidder
//   const loginUser = JSON.parse(localStorage.getItem("user"));
//   const senderId = loginUser?.userId;

//   // const senderId = 90002;
//   useEffect(() => {
//     const storedUser = localStorage.getItem("senderName");
//     if (storedUser) setUser(Number(storedUser));
//     fetchMessages();
//   }, []);

//   const fetchMessages = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const res = await axios.get(
//         `http://localhost:3001/chatbox/conversation/${props?.task?.taskUserId}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       console.log("hsdgfjhgfjh", res.data);
//       setMessages(res.data.data);
//     } catch (err) {
//       console.error(
//         "Error fetching messages:",
//         err?.response?.data || err.message
//       );
//     }
//   };

//   const sendMessage = async () => {
//     if (file) {
//       await sendMessageFile(file, input); // send file and message
//     } else {
//       try {
//         const token = localStorage.getItem("token");
//         await axios.post(
//           "http://localhost:3001/chatbox/send",
//           {
//             senderId,
//             receiverId: props?.task?.taskUserId,
//             taskId: props?.task?.taskId,
//             message: input,
//           },
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );

//         setInput("");
//         setFile(null);
//         fetchMessages();
//       } catch (err) {
//         console.error("Error sending message:", err);
//       }
//     }
//   };

//   const sendMessageFile = async (fileToSend, textMessage = "") => {
//     try {
//       const token = localStorage.getItem("token");
//       const formData = new FormData();

//       formData.append("senderId", senderId);
//       formData.append("receiverId", props?.task?.taskUserId);
//       formData.append("taskId", props?.task?.taskId);
//       formData.append("message", textMessage || fileToSend.name);
//       formData.append("file", fileToSend);

//       await axios.post("http://localhost:3001/chatbox/send", formData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "multipart/form-data",
//         },
//       });

//       setInput("");
//       setFile(null);
//       fetchMessages();
//     } catch (err) {
//       console.error("Error sending file message:", err);
//     }
//   };

//   const handleFileChange = (e) => {
//     const selectedFile = e.target.files[0];
//     if (selectedFile) {
//       setFile(selectedFile); // wait for user to hit Send
//     }
//   };

//   useEffect(() => {
//     chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   return (
//     <Box
//       sx={{
//         maxWidth: 1500,
//         mx: "auto",
//         height: "100vh",
//         display: "flex",
//         flexDirection: "column",
//       }}
//     >
//       <Typography
//         variant="h6"
//         align="center"
//         p={2}
//         bgcolor="primary.main"
//         color="white"
//       >
//         Chat with {props?.task?.taskUserId}
//       </Typography>

//       {/* Scrollable message section */}
//       <Paper
//         elevation={0}
//         sx={{
//           flex: 1,
//           overflowY: "auto",
//           p: 2,
//           bgcolor: "#f0f0f0",
//         }}
//       >
//         {messages.map((msg, i) => {
//           const isSender = Number(msg.sender) === Number(user);
//           const timestamp = new Date(msg.timestamp);
//           const time = timestamp.toLocaleTimeString([], {
//             hour: "2-digit",
//             minute: "2-digit",
//           });

//           return (
//             <Box
//               key={i}
//               sx={{
//                 display: "flex",
//                 flexDirection: "column",
//                 // alignItems:  'flex-start' : 'flex-end',
//                 alignItems:
//                   msg.senderId === senderId ? "flex-end" : "flex-start",

//                 mb: 2,
//               }}
//             >
//               <Box
//                 sx={{
//                   display: "flex",
//                   alignItems: "center",
//                   maxWidth: "75%",
//                   bgcolor: isSender ? "#DCF8C6" : "white",
//                   p: 1.5,
//                   borderRadius: 3,
//                   boxShadow: 1,
//                 }}
//               >
//                 <Avatar sx={{ mr: 1 }}>{String(msg.sender)[0]}</Avatar>
//                 <Box>
//                   <Typography variant="body2" sx={{ wordBreak: "break-word" }}>
//                     {msg.message}
//                   </Typography>
//                   {msg.fileUrl && (
//                     <Box mt={1}>
//                       {msg.fileType?.startsWith("image") && (
//                         <img
//                           src={msg.fileUrl}
//                           alt="img"
//                           width="200"
//                           style={{ borderRadius: 8 }}
//                         />
//                       )}
//                       {msg.fileType?.startsWith("video") && (
//                         <video src={msg.fileUrl} controls width="250" />
//                       )}
//                       {msg.fileType?.startsWith("application") && (
//                         <a
//                           href={msg.fileUrl}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                         >
//                           Download File
//                         </a>
//                       )}
//                     </Box>
//                   )}
//                   <Typography
//                     variant="caption"
//                     color="text.secondary"
//                     sx={{ mt: 0.5, textAlign: "left" }}
//                   >
//                     {time}
//                   </Typography>
//                 </Box>
//               </Box>
//             </Box>
//           );
//         })}
//         <div ref={chatEndRef} />
//       </Paper>

//       {/* Fixed input area at bottom */}
//       <Box
//         sx={{
//           p: 2,
//           borderTop: "2px solid #ddd",
//           display: "flex",
//           alignItems: "center",
//           bgcolor: "white",
//         }}
//       >
//         <TextField
//           multiline
//           maxRows={4}
//           fullWidth
//           placeholder="Type a message"
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           sx={{
//             mr: 1,
//             "& .MuiInputBase-root": {
//               overflowY: "auto",
//             },
//           }}
//         />
//         <input
//           type="file"
//           id="file-input"
//           hidden
//           accept="image/*,application/pdf,video/*"
//           onChange={handleFileChange}
//         />
//         <label htmlFor="file-input">
//           <IconButton component="span">
//             <AttachFileIcon />
//           </IconButton>
//         </label>
//         <IconButton color="primary" onClick={sendMessage}>
//           <SendIcon />
//         </IconButton>
//       </Box>
//     </Box>
//   );
// };

// export default App;
