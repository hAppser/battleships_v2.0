import { useState, useEffect, useRef } from "react";
import { useAppSelector } from "../../hooks/redux";
import { IMessage } from "../../Interfaces/IMessage";
import "./Chat.css";

const Chat = ({ socket }: any) => {
  const [message, setMessage] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { gameId, username, chat } = useAppSelector(
    (state) => state.gameReducer
  );
  const chatLogRef = useRef<HTMLDivElement>(null);
  const isAtBottomRef = useRef(true);

  useEffect(() => {
    if (chatLogRef.current && isAtBottomRef.current) {
      chatLogRef.current.scrollTop = chatLogRef.current.scrollHeight;
    }
  }, [chat]);

  const handleMessageChange = (event: React.FormEvent<HTMLInputElement>) => {
    setMessage(event.currentTarget.value);
  };

  const handleSendMessage = () => {
    if (message.trim() !== "") {
      socket.send(
        JSON.stringify({
          event: "message",
          payload: { username, message, gameId },
        })
      );
      setMessage("");
    }
  };

  const handleToggleChat = () => {
    setIsChatOpen((prevIsChatOpen) => !prevIsChatOpen);
  };

  const handleChatScroll = () => {
    if (chatLogRef.current) {
      const { scrollTop, clientHeight, scrollHeight } = chatLogRef.current;
      isAtBottomRef.current = scrollTop + clientHeight >= scrollHeight - 1;
    }
  };

  return (
    <div className={`Chat ${isChatOpen ? "" : "open"}`}>
      <div className="chat-container">
        <div className="chat-log" ref={chatLogRef} onScroll={handleChatScroll}>
          {chat.map((msg: IMessage, index: number) => (
            <div key={index} className="chat-item">
              <div className="chat-username">{msg.username + ":"}</div>
              <div className="chat-message">{msg.message}</div>
            </div>
          ))}
        </div>
        <div className="input-container">
          <input
            type="text"
            value={message}
            onChange={handleMessageChange}
            placeholder="Введите сообщение..."
          />
          <button onClick={handleSendMessage}>Send</button>
        </div>
      </div>

      <div
        className={`toggle-button ${isChatOpen ? "open" : ""}`}
        onClick={handleToggleChat}
      >
        <span className="toggle-button-icon"></span>
      </div>
    </div>
  );
};

export default Chat;
