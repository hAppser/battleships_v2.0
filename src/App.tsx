import React, { useState } from "react";
import MainMenu from "./components/MainMenu/MainMenu";
import Login from "./components/Login/Login";
import { Route, Routes } from "react-router-dom";
import GamePage from "./components/GamePage/GamePage";
import "./App.css";
import { useAppSelector } from "./hooks/redux";

const App: React.FC = () => {
  const [username, setUsername] = useState("");
  const socket = new WebSocket("ws://localhost:8080");
  return (
    <div className="App">
      <nav>
        <div>Battleship</div>
      </nav>
      <main className="main">
        <Routes>
          <Route path="/" element={<Login onLogin={setUsername} />}></Route>
          <Route
            path="/menu"
            element={<MainMenu username={username} onLogin={setUsername} />}
          />
          <Route path="/game">
            <Route path=":gameId" element={<GamePage socket={socket} />} />
          </Route>
        </Routes>
      </main>
    </div>
  );
};

export default App;
