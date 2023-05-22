import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import MainMenu from "./components/MainMenu/MainMenu";
import Login from "./components/Login/Login";
const App: React.FC = () => {
  const [username, setUsername] = useState("");
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    socketRef.current = new WebSocket("ws://localhost:8080");

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);

  const sendMessage = (message: string) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(`Username: ${message}`);
    }
  };
  return (
    <div className="App">
      <nav>
        <div>Battleship</div>
      </nav>
      <main className="main">
        {username ? (
          <MainMenu username={username} />
        ) : (
          <Login onLogin={setUsername} sendMessage={sendMessage} />
        )}
      </main>
    </div>
  );
};

export default App;
