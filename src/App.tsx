<<<<<<< HEAD
import React, { useState } from "react";
import MainMenu from "./components/MainMenu/MainMenu";
import Login from "./components/Login/Login";
import { Route, Routes } from "react-router-dom";
import GamePage from "./components/GamePage/GamePage";
import "./App.css";

const App: React.FC = () => {
  const [username, setUsername] = useState("");
  const socket = new WebSocket("ws://localhost:8080");

  console.log(socket);
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
            <Route path=":gameId" element={<GamePage socketRef={socket} />} />
          </Route>
        </Routes>
      </main>
    </div>
  );
};
=======
import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}
>>>>>>> 0503eff (Initialize project using Create React App)

export default App;
