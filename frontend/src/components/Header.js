import React from "react";
import "./styles.css";

const Header = () => {
  return (
    <header className="header-wrapper">
      <div>
        <a href="/">Chatbot</a>
      </div>
      <div>
        <a href="/about">Giới thiệu</a>
      </div>
    </header>
  );
};

export default Header;
