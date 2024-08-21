import React, { useEffect, useState } from "react";
import config from "../config";

const Conversation = ({ data, currentUser, online, read }) => {
  const [userData, setUserData] = useState(null);
  useEffect(() => {
    const userId = data.members.find((m) => m !== currentUser);

    const getUserData = async () => {
      try {
        const res = await fetch(`${config.API_URL}/user/id/${userId}`);
        const data = await res.json();
        setUserData(data);
      } catch (err) {
        console.log(err);
      }
    };
    getUserData();
  }, [currentUser, data]);
  return (
    <>
      <div className="follower conversation">
        <div className="container1">
          {online && <div className="online-dot"></div>}
          <img
            src="/bot.png"
            alt="Profile"
            className="followerImage"
            style={{ width: "50px", height: "50px" }}
          />
          <div className="name" style={{ fontSize: "0.8rem" }}>
            <span>{userData?.name}</span>
            <br />
            <span style={{ color: online ? "#51e200" : "" }}>
              {online ? "Online" : "Offline"}
            </span>
          </div>
          {read === "unread" && <div className="unread"></div>}
        </div>
      </div>
      <hr style={{ width: "85%", border: "0.1px solid #ececec" }} />
    </>
  );
};

export default Conversation;
