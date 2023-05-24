import React, { useEffect, useRef, useState } from "react";
import MainMenu from "./components/MainMenu/MainMenu";
import Login from "./components/Login/Login";
import { Route, Routes } from "react-router-dom";
import GamePage from "./components/GamePage/GamePage";
import "./App.css";

const App: React.FC = () => {
  const [username, setUsername] = useState("");
  const socketRef = useRef<WebSocket | null>(null);
  useEffect(() => {
    socketRef.current = new WebSocket("ws://localhost:8080");
  }, []);
  console.log(socketRef.current);

  return (
    <div className="App">
      <nav>
        <div>Battleship</div>
      </nav>
      <main className="main">
        <Routes>
          <Route path="/" element={<Login onLogin={setUsername} />}></Route>
          <Route path="/menu" element={<MainMenu username={username} />} />
          <Route path="/game">
            <Route
              path=":gameId"
              element={<GamePage socketRef={socketRef.current} />}
            />
          </Route>
        </Routes>
      </main>
    </div>
  );
};

export default App;
