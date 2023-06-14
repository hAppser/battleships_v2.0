import { useEffect, useState } from "react";

const Chat = ({ socket, username, gameId }: any) => {
  const [message, setMessage] = useState("");
  const [chatLog, setChatLog] = useState([]);
  const handleMessageChange = (event: React.FormEvent<HTMLInputElement>) => {
    setMessage(event.currentTarget.value);
  };

  const handleSendMessage = () => {
    if (message.trim() !== "") {
      socket.send(
        JSON.stringify({
          event: "message",
          payload: { username: localStorage.username, gameId, message },
        })
      );
      setMessage("");
    }
  };
  return (
    <div className="Chat">
      <div className="chat-log">
        {chatLog.map((msg: string, index: number) => (
          <div key={index}>
            {username} {msg}
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
        <button onClick={handleSendMessage}>Отправить</button>
      </div>
    </div>
  );
};
export default Chat;
