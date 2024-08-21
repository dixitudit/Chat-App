import React, { useEffect, useState } from "react";
import { useRef } from "react";
import "./ChatBox.css";
import { format } from "timeago.js";
import config from "../config";
import InputEmoji from "react-input-emoji";

const ChatBox = ({ chat, currentUser, setSendMessage, receivedMessage }) => {
  const [userData, setUserData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const handleChange = (newMessage) => {
    setNewMessage(newMessage);
  };

  // fetching data for header
  useEffect(() => {
    const userId = chat?.members?.find((id) => id !== currentUser);
    const getUserData = async () => {
      try {
        const res = await fetch(`${config.API_URL}/user/id/${userId}`);
        const data = await res.json();
        setUserData(data);
      } catch (error) {
        console.log(error);
      }
    };

    if (chat !== null) getUserData();
  }, [chat, currentUser]);

  // fetch messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch(`${config.API_URL}/message/${chat._id}`);
        const data = await res.json();
        setMessages(data);
      } catch (error) {
        console.log(error);
      }
    };

    if (chat !== null) fetchMessages();
  }, [chat]);

  // Always scroll to last Message
  useEffect(() => {
    scroll.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send Message
  const handleSend = async (e) => {
    e.preventDefault();
    const message = {
      senderId: currentUser,
      text: newMessage,
      chatId: chat._id,
    };
    const receiverId = chat.members.find((id) => id !== currentUser);
    // send message to socket server
    setSendMessage({ ...message, receiverId });
    // send message to database
    try {
      const res = await fetch(`${config.API_URL}/message`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(message),
      });
      const data = await res.json();
      setMessages([...messages, data]);
      setNewMessage("");
    } catch {
      console.log("error");
    }
  };

  // Receive Message from parent component
  useEffect(() => {
    if (
      chat !== null &&
      receivedMessage !== null &&
      receivedMessage.chatId === chat._id
    ) {
      setMessages([...messages, receivedMessage]);
    }
  }, [receivedMessage]);

  const scroll = useRef();
  return (
    <>
      <div className="ChatBox-container">
        {chat ? (
          <>
            {/* chat-header */}
            <div className="chat-header">
              <div className="follower">
                <div className="container1">
                  <img
                    src="bot.png"
                    alt="Profile"
                    className="followerImage"
                    style={{ width: "50px", height: "50px" }}
                  />
                  <div className="nameHeader" style={{ fontSize: "0.9rem" }}>
                    <span>{userData?.name}</span>
                  </div>
                </div>
              </div>
              <hr
                style={{
                  width: "95%",
                  border: "0.1px solid #ececec",
                  marginTop: "20px",
                }}
              />
            </div>
            {/* chat-body */}
            <div className="chat-body">
              {messages.map((message, i) => (
                <div
                  ref={scroll}
                  className={
                    message.senderId === currentUser ? "message own" : "message"
                  }
                  key={i}
                >
                  <span>{message.text}</span>{" "}
                  <span>{format(message.createdAt)}</span>
                </div>
              ))}
            </div>
            {/* chat-sender */}
            <div className="chat-sender">
              <InputEmoji value={newMessage} onChange={handleChange} />

              <div className="btn sendbtn" onClick={handleSend}>
                Send
              </div>
            </div>
          </>
        ) : (
          <span className="chatbox-empty-message">
            Tap on a chat to start conversation...
          </span>
        )}
      </div>
    </>
  );
};

export default ChatBox;
