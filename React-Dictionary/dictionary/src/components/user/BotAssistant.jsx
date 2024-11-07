import { Box, IconButton, TextField, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import SendIcon from "@mui/icons-material/Send";
import StopIcon from "@mui/icons-material/Stop";
import ChatBot from "../../api/Bot";
import Authentication from "../../others/Authentication";

const BotAssistant = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatBoxRef = useRef(null);
  const chatBot = ChatBot();

  const handleSend = (e) => {
    e.preventDefault();
    if (input.trim()) {
      if (!Authentication.isValid()) {
        setMessages([
          ...messages,
          { text: input.trim(), sender: "user" },
          { text: "Vui lòng đăng nhập để được trợ giúp!", sender: "bot" },
        ]);
        setInput("");
        return;
      }
      setMessages([...messages, { text: input.trim(), sender: "user" }]);
      setInput("");
      setIsLoading(true);
      chatBot.response(input).then((data) => {
        console.log(data);
        setMessages([
          ...messages,
          { text: input.trim(), sender: "user" },
          { text: data.trim(), sender: "bot" },
        ]);
        setIsLoading(false);
      });
    }
  };

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <Box
      sx={{
        width: "400px",
        border: "1px solid #ccc",
        borderRadius: 2,
        padding: 2,
        display: "flex",
        flexDirection: "column",
        height: "100%",
        boxShadow: "0 0 10px grey",
      }}
    >
      <Box ref={chatBoxRef} sx={{ flexGrow: 1, overflowY: "auto", mb: 2 }}>
        {messages.map((msg, index) =>
          msg.sender === "bot" ? (
            <Typography
              key={index}
              align="left"
              sx={{
                margin: "5px 0",
                bgcolor: "rgba(0,0,0,.1)",
                padding: 1,
                width: "85%",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                borderRadius: 2,
              }}
            >
              {msg.text}
            </Typography>
          ) : (
            <Typography
              key={index}
              align="left"
              sx={{
                margin: "5px 0",
                bgcolor: "lightblue",
                padding: 1,
                width: "85%",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                borderRadius: 2,
                ml: "auto",
              }}
            >
              {msg.text}
            </Typography>
          )
        )}
      </Box>
      <Box
        component="form"
        onSubmit={handleSend}
        sx={{ display: "flex", alignItems: "center", gap: 2 }}
      >
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Type a message..."
          value={input}
          disabled={isLoading}
          onChange={(e) => setInput(e.target.value)}
        />
        <IconButton type="submit" disabled={isLoading} color="primary">
          {isLoading ? <StopIcon /> : <SendIcon />}
        </IconButton>
      </Box>
    </Box>
  );
};

export default BotAssistant;
