import { Link } from "react-router-dom";
import "./Home.css";
import { TypeAnimation } from "react-type-animation";
import { useState } from "react";
import { useSelector } from "react-redux";

const Home = () => {
  const [typingStatus, setTypingStatus] = useState("human1");
  const currentUser = useSelector((state) => state.currentUser);
  return (
    <div className="homepage">
      <div className="left">
        <h1>Chat App</h1>
        <h2>Stay Connected, Anywhere, Anytime</h2>
        <h3>
          Join our chat app and experience seamless communication with friends
          and family. Send and receive messages instantly with real-time syncing
          across all devices.
        </h3>
        <Link to={!currentUser ? "/signin" : "/chats"} className="btn">
          Get Started
        </Link>
      </div>
      <div className="right">
        <div className="imgContainer">
          <div className="bgContainer">
            <div className="bg"></div>
          </div>
          <img src="/bot.png" alt="" className="bot" />
          <div className="chat">
            <img
              src={typingStatus === "human1" ? "/human1.jpeg" : "/human2.jpeg"}
              alt=""
            />
            <TypeAnimation
              sequence={[
                // Same substring at the start will only be typed out once, initially
                "Bob:We produce food for Mice",
                2000,
                () => {
                  setTypingStatus("human2");
                },
                "Alice:We produce food for Guinea Pigs",
                2000,
                () => {
                  setTypingStatus("human1");
                },
              ]}
              wrapper="span"
              repeat={Infinity}
              cursor={true}
              omitDeletionAnimation={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
