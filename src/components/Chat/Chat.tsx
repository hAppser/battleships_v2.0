import { useState } from "react";
import { useAppSelector } from "../../hooks/redux";
import { IMessage } from "../../Interfaces/IMessage";

const Chat = ({ socket }: any) => {
  const [message, setMessage] = useState("");

  const { gameId, username, chat } = useAppSelector(
    (state) => state.gameReducer
  );
  const handleMessageChange = (event: React.FormEvent<HTMLInputElement>) => {
    setMessage(event.currentTarget.value);
  };

  const handleSendMessage = () => {
    if (message.trim() !== "") {
      socket.send(
        JSON.stringify({
          event: "msg",
          payload: { username, message, gameId },
        })
      );
      setMessage("");
    }
  };
  return (
    <div className="Chat">
      <div className="chat-log">
        {chat.map((msg: IMessage, index: number) => (
          <div key={index}>
            {msg.name} {msg.message}
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
