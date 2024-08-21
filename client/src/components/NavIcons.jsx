import React from "react";
import { FiSettings } from "react-icons/fi";
import { FaRegCommentDots } from "react-icons/fa";
import { IoMdNotifications } from "react-icons/io";
import { AiFillHome } from "react-icons/ai";
import { Link } from "react-router-dom";

const NavIcons = () => {
  return (
    <div className="navIcons">
      <Link to="/">
        <AiFillHome size="30px" color="#e55571" />
      </Link>
      <FiSettings size="30px" color="#e55571" />
      <IoMdNotifications size="30px" color="#e55571" />
      <Link to="/chats">
        <FaRegCommentDots size="30px" color="#e55571" />
      </Link>
    </div>
  );
};

export default NavIcons;
