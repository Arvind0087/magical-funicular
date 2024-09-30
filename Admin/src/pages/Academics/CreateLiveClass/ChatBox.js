import React, { useEffect, useState, useRef, useCallback } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
// import { chatData } from "./chatData";
import chatSend from "../../../assets/images/chat/chat-send.jpg";
import { useDispatch, useSelector } from "react-redux";
import socketio from "socket.io-client";
import Picker from "emoji-picker-react";
import { getyoutubeChatsAsync } from "../../../redux/liveChat/livechat.async";
import newLogo from "../../../assets/veda-logo-2.png";
import "./styles.css";

const ChatMessage = React.memo(({ chat }) => {
  const firstLetter = chat?.userName?.slice(0, 2).toUpperCase();

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "flex-start",
        p: "2px 5px",
        mb: "5px",
        "&:hover": {
          backgroundColor: "#ebebeb",
          borderRadius: "5px",
        },
      }}
    >
      {chat?.avatar ? (
        <img
          src={chat?.avatar}
          alt=""
          width="25px"
          height="26px"
          style={{
            borderRadius: "50%",
            marginRight: "10px",
            background: "aliceblue",
            padding: chat?.role === "Teacher" ? "4px" : "0px",
          }}
        />
      ) : (
        <Box
          sx={{
            width: "25px",
            height: "25px",
            backgroundColor: "#f2f2f2",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginRight: "10px",
          }}
        >
          <Typography sx={{ fontSize: "12px" }}>{firstLetter}</Typography>
        </Box>
      )}

      <Typography sx={{ fontSize: "13px", fontWeight: "400", pb: 1 }}>
        <span style={{ fontWeight: "600" }}>{chat?.userName}</span>{" "}
        {chat?.role === "Teacher" && (
          <span
            style={{ fontSize: "10px", color: "#f26e36", marginRight: "10px" }}
          >
            (Teacher)
          </span>
        )}
        {chat?.message}
      </Typography>
    </Box>
  );
});

function ChatBox({ eventId, isLive, eventById }) {
  const dispatch = useDispatch();
  const [showPicker, setShowPicker] = useState(false);
  const { chatLoader, getChatData } = useSelector((state) => state.liveChat);
  const chatContainerRef = useRef(null);
  const { studentById } = useSelector((state) => state.student);
  const [displayHeight, setDisplayHeight] = useState("80vh");
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const { userinfo } = useSelector((state) => state.userinfo);

  useEffect(() => {
    if (getChatData?.data) {
      setMessages(getChatData.data);
    }
  }, [getChatData]);

  // useEffect(() => {
  //   const newSocket = socketio("https://api.vedaacademy.org.in");
  //   setSocket(newSocket);
  //   return () => newSocket.disconnect();
  // }, []);

  useEffect(() => {
    const newSocket = socketio("https://api.vedaacademy.org.in", {
      reconnectionAttempts: 5, // retry connection 5 times
      reconnectionDelay: 2000, // wait for 2 seconds before retrying
    });

    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Connected to socket:", newSocket.id);
    });

    newSocket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    newSocket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    return () => {
      if (newSocket) {
        newSocket.disconnect();
        console.log("Socket disconnected on cleanup");
      }
    };
  }, []);

  const sendMessage = useCallback(() => {
    if (socket && message) {
      const role = "Teacher";
      const userId = userinfo?.id;
      socket.emit("send-message", message, eventId, role, userId);
      setMessage("");
    }
  }, [socket, message, eventId, userinfo]);

  useEffect(() => {
    if (socket) {
      socket.on("receive-message", (data) => {
        // setMessages(data);
        if (data?.eventId == eventId) {
          setMessages((prevMessages) => [...prevMessages, data]);
        }
        // dispatch(getyoutubeChatsAsync({ eventId }));
      });
    }
    return () => {
      if (socket) {
        socket.off("receive-message");
      }
    };
  }, [socket, dispatch, eventId]);

  useEffect(() => {
    const payload = { eventId };
    dispatch(getyoutubeChatsAsync(payload));
  }, []);

  const submitChat = (e) => {
    e.preventDefault();
    sendMessage();
  };

  const displayPicker = () => {
    setShowPicker((val) => !val);
  };

  useEffect(() => {
    setDisplayHeight(showPicker ? "20vh" : "80vh");
  }, [showPicker]);

  const onEmojiClick = (event) => {
    if (event?.emoji) {
      setMessage((prevInput) => prevInput + event?.emoji);
    }
  };

  // Scroll to bottom whenever messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages, getChatData]);

  // let localChatData = messages?.length > 0 ? messages : getChatData?.data;

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
      setMessage("");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        borderRadius: "10px",
        border: "1px solid #ccc",
        height: "80vh",
        minWidth: "298px",
        maxHeight: "430px",
        overflow: "hidden",
      }}
    >
      <Box sx={{ ml: 2, mt: 1 }}>
        <Typography sx={{ fontSize: "22px", fontWeight: "600" }}>
          Live Chat
        </Typography>
      </Box>
      <Box
        ref={chatContainerRef}
        sx={{
          mt: 2,
          ml: 2,
          height: displayHeight,
          overflowY: "scroll",
          pr: 2,
        }}
        className="scroll-design"
      >
        {/*getChatData?.data?.map((chat) => (
          <ChatMessage key={chat.id} chat={chat} />
        ))*/}

        {messages?.map((chat) => (
          <ChatMessage key={chat.id} chat={chat} />
        ))}
      </Box>
      <Box
        sx={{
          borderTop: "1px solid #ccc",
          maxHeight: "60vh",
          minHeight: "10vh",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mt: "2%",
            // pointerEvents: isLive && eventById?.isLiveChat ? "" : "none",
            pointerEvents: eventById?.isLiveChat ? "" : "none",
          }}
        >
          <Box sx={{ width: "65%" }}>
            <Box className="input-container">
              <input
                type="text"
                placeholder="Chat..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <img
                className="emoji-icon"
                src="https://icons.getbootstrap.com/assets/icons/emoji-smile.svg"
                onClick={displayPicker}
                style={{ cursor: "pointer", marginRight: "5px" }}
              />
            </Box>
          </Box>
          {message && (
            <Button sx={{ ml: 2, cursor: "pointer" }} onClick={submitChat}>
              <img src={chatSend} alt="chat send" width="25px" height="25px" />
            </Button>
          )}
        </Box>
        {showPicker && (
          <Box
            sx={{ margin: "auto", width: "95%", ml: 1, mr: 1, mt: "5px" }}
            className="emoji-container"
          >
            <Picker
              pickerStyle={{ width: "100%", height: "auto" }}
              onEmojiClick={onEmojiClick}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default ChatBox;
