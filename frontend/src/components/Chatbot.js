import React, { useRef, useState } from "react";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
} from "@chatscope/chat-ui-kit-react";
import styles from "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import "./styles.css";
import Modal from "./Modal";
import Dropdown from "./Dropdown";
import ModalAudio from "./ModalAudio";

const API_KEY = process.env.REACT_APP_OPENAI_API_KEY;

const systemMessage = {
  role: "system",
  content:
    "Explain things like you're talking to a software professional with 2 years of experience.",
};

const Chatbot = () => {
  const inputFile = useRef(null);

  const [messages, setMessages] = useState([
    {
      message: "Xin chào, tôi là Math Web! Hãy hỏi tôi về toán học nào!",
      sender: "ChatGPT",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [image, setImage] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [isShow, setIsShow] = useState(false);
  const [isAudio, setIsAudio] = useState(false);

  const handleSend = async (message) => {
    const newMessage = {
      message,
      direction: "outgoing",
      sender: "user",
    };
    const newMessages = [...messages, newMessage];
    setMessages(newMessages);
    setIsTyping(true);
    await processMessageToChatGPT(newMessages);
  };

  const handleAttach = () => {
    setIsShow(!isShow);
  };

  const handleChange = (e) => {
    var reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = () => {
      setImage(reader.result);
      setOpenModal(true);
    };
    reader.onerror = (error) => {
      console.log("Error: ", error);
    };
  };

  const processMessageToChatGPT = async (chatMessages) => {
    let apiMessages = chatMessages.map((messageObject) => {
      let role = "";
      if (messageObject.sender === "ChatGPT") {
        role = "assistant";
      } else {
        role = "user";
      }
      return { role: role, content: messageObject.message };
    });
    const apiRequestBody = {
      model: "gpt-3.5-turbo",
      messages: [systemMessage, ...apiMessages],
    };

    await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(apiRequestBody),
    })
      .then((data) => {
        return data.json();
      })
      .then((data) => {
        setMessages([
          ...chatMessages,
          {
            message: data.choices[0].message.content,
            sender: "ChatGPT",
          },
        ]);
        setIsTyping(false);
      });
  };

  return (
    <div>
      <div className="chatbot-wrapper">
        <MainContainer>
          <ChatContainer>
            <MessageList
              scrollBehavior="smooth"
              typingIndicator={
                isTyping ? (
                  <TypingIndicator content="Math Web đang nhắn cho bạn..." />
                ) : null
              }
            >
              {messages.map((message, i) => {
                return <Message key={i} model={message} />;
              })}
            </MessageList>
            <MessageInput
              placeholder="Ghi câu hỏi của bạn..."
              onSend={handleSend}
              onAttachClick={handleAttach}
            />
          </ChatContainer>
        </MainContainer>
        <input
          type="file"
          accept="image/*"
          id="file"
          ref={inputFile}
          style={{ display: "none" }}
          onChange={(e) => handleChange(e)}
          onClick={(event) => {
            event.target.value = null;
          }}
        />
        <Dropdown show={isShow} setImage={inputFile} setAudio={setIsAudio} />
      </div>
      <Modal
        open={openModal}
        onClose={setOpenModal}
        image={image}
        onProcessData={handleSend}
      />
      <ModalAudio
        open={isAudio}
        onClose={setIsAudio}
        onProcessData={handleSend}
      />
    </div>
  );
};

export default Chatbot;
