import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import MainMenu from "./components/MainMenu/MainMenu";
import Login from "./components/Login/Login";
import { BrowserRouter, Route, Routes } from "react-router-dom";
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
      {/* <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={<Login onLogin={setUsername} sendMessage={sendMessage} />}
          />
          <Route path="/username">
            <Route
              path="/username"
              element={<MainMenu username={username} />}
            />
          </Route>
        </Routes>
      </BrowserRouter> */}

      <main className="main">
        {username ? (
          <MainMenu />
        ) : (
          <Login onLogin={setUsername} sendMessage={sendMessage} />
        )}
      </main>
    </div>
  );
};

export default App;
