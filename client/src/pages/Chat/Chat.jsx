import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import "./Chat.css";
import { TbMessagePlus } from "react-icons/tb";
import Conversation from "../../components/Conversation";
import ChatBox from "../../components/ChatBox";
import { io } from "socket.io-client";
import { LuLogOut } from "react-icons/lu";
import { SlClose } from "react-icons/sl";
import { FaSearchPlus } from "react-icons/fa";
import { signOut } from "../../redux/userSlice";
import config from "../../config";

const Chat = () => {
  const currentUser = useSelector((state) => state.currentUser);
  const dispatch = useDispatch();
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [searchErr, setSearchErr] = useState(null);
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [sendMessage, setSendMessage] = useState(null);
  const socket = useRef();
  const [receiveMessage, setReceiveMessage] = useState(null);
  const [search, setSearch] = useState(null);
  const [openSearch, setOpenSearch] = useState(false);
  const [newChat, setNewChat] = useState(null);
  const [newChatAdded, setNewChatAdded] = useState(false);
  const [unreadChats, setUnreadChats] = useState([]);

  // to send and recieve messages
  useEffect(() => {
    if (socket.current) {
      socket.current.on("recieve-message", (data) => {
        setReceiveMessage(data);
        console.log(data);
        if (!currentChat || currentChat._id !== data.chatId) {
          setUnreadChats((prev) => {
            if (prev.includes(data.chatId)) return prev;
            return [...prev, data.chatId];
          });
        }
      });
    }
  }, [socket.current, currentChat]);

  useEffect(() => {
    if (sendMessage) {
      socket.current.emit("send-message", sendMessage);
    }
  }, [sendMessage]);

  // automatically add chat to reciever

  useEffect(() => {
    if (socket.current) {
      socket.current.on("add-chat", () => {
        setNewChatAdded(!newChatAdded);
      });
    }
  }, [socket.current, newChatAdded]);

  useEffect(() => {
    if (newChat) socket.current.emit("add-chat", newChat.receiverId);
  }, [newChat]);

  useEffect(() => {
    socket.current = io("http://localhost:8800");
    socket.current.emit("new-user-add", currentUser._id);
    socket.current.on("get-users", (users) => {
      setOnlineUsers(users);
    });
  }, [currentUser]);

  useEffect(() => {
    if (unreadChats?.includes(currentChat?._id)) {
      setUnreadChats(
        unreadChats.filter((chatId) => chatId !== currentChat._id)
      );
    }
  }, [currentChat]);

  useEffect(() => {
    const getChats = async () => {
      try {
        const res = await fetch(`${config.API_URL}/chat/${currentUser._id}`);
        const data = await res.json();
        setChats(data);
      } catch (err) {
        console.log(err);
      }
    };
    getChats();
  }, [currentUser._id, newChatAdded]);

  const checkOnlineStatus = (chat) => {
    const chatMember = chat.members.find(
      (member) => member !== currentUser._id
    );
    const online = onlineUsers.find((user) => user.userId === chatMember);
    return online ? true : false;
  };

  const handleAddChat = () => {
    setOpenSearch(!openSearch);
    setSearchErr(null);
  };

  const handleInput = (e) => {
    setSearch(e.target.value);
  };

  const searchAdd = async () => {
    if (!search) {
      setSearchErr("Enter Username or Email");
    }
    try {
      const res = await fetch(`${config.API_URL}/user/find/${search}`);
      if (res.ok) {
        const data = await res.json();
        if (currentUser._id === data._id) {
          setSearchErr("You can't chat with yourself");
          return;
        }
        setNewChat({
          senderId: currentUser._id,
          receiverId: data._id,
        });
        const response = await fetch(`${config.API_URL}/chat`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            senderId: currentUser._id,
            receiverId: data._id,
          }),
        });

        const chat = await response.json();
        setCurrentChat(chat);
        setOpenSearch(false);
        setNewChatAdded(!newChatAdded);
        console.log(chat);
      } else {
        setSearchErr("User Not Found");
      }
    } catch (err) {
      setSearchErr("User Not Found");
      console.log("kuch " + err);
    }
  };
  return (
    <div className="Chat">
      <div className="Left-side-chat">
        <div className="container1">
          <img src="bot.png" alt="bot" className="bot-img" />
          <h2 className="logo">Chat App</h2>
        </div>
        <div className="Chat-container">
          <div className="nomargin">
            <h2>Chats</h2>
            {!openSearch && (
              <div onClick={handleAddChat} className="addChat">
                <TbMessagePlus size={"1.5rem"} />
              </div>
            )}
            {openSearch && (
              <div onClick={handleAddChat} className="addChat">
                <SlClose size={"1.2rem"} />
              </div>
            )}
          </div>
          {openSearch && (
            <>
              <p className="headAddChat">Add Chat</p>
              {searchErr && <p className="error">{searchErr}</p>}
              <div className="search">
                <input
                  type="text"
                  placeholder="Email or Username"
                  onChange={handleInput}
                />
                <FaSearchPlus
                  className="searchAdd"
                  size={"1.5rem"}
                  onClick={searchAdd}
                />
              </div>
            </>
          )}
          <div className="Chat-list">
            {chats.map((item, i) => {
              return (
                <div onClick={() => setCurrentChat(item)} key={i}>
                  <Conversation
                    data={item}
                    currentUser={currentUser._id}
                    online={checkOnlineStatus(item)}
                    read={`${unreadChats.includes(item._id) ? "unread" : ""}`}
                  />
                </div>
              );
            })}
          </div>
          {/* // add logout button */}
          <div className="logout">
            <div>{currentUser.username}</div>
            <div>{currentUser.email}</div>
            <div>{currentUser.name}</div>
            <hr
              style={{
                width: "95%",
                border: "0.1px solid #ececec",
              }}
            />
            <button
              onClick={() => {
                dispatch(signOut());
                Cookies.remove("token");
                socket.current.emit("custom-disconnect", currentUser._id);
                socket.current.on("get-users", (users) => {
                  setOnlineUsers(users);
                });
              }}
              className="logout-btn"
            >
              <div>Logout</div>
              <div>
                <LuLogOut />
              </div>
            </button>
          </div>
        </div>
      </div>
      <div className="Right-side-chat">
        {/* <div style={{ width: "20rem", alignSelf: "flex-end" }}>
          <NavIcons />
        </div> */}
        <ChatBox
          chat={currentChat}
          currentUser={currentUser._id}
          setSendMessage={setSendMessage}
          receivedMessage={receiveMessage}
        />
      </div>
    </div>
  );
};

export default Chat;
