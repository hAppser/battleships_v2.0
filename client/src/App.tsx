import MainMenu from "./components/MainMenu/MainMenu";
import Login from "./components/Login/Login";
import { Route, Routes, useNavigate } from "react-router-dom";
import GamePage from "./components/GamePage/GamePage";
import "./App.css";

const App: React.FC = () => {
  const socket = new WebSocket("ws://localhost:8080");
  const navigate = useNavigate();

  return (
    <div className="App">
      <nav>
        <div>
          <span className="nav-title" onClick={() => navigate("/menu")}>
            Battleship
          </span>
        </div>
      </nav>
      <main className="main">
        <Routes>
          <Route path="/" element={<Login />}></Route>

          <Route path="/menu" element={<MainMenu socket={socket} />} />
          <Route path="/game">
            <Route path=":gameId" element={<GamePage socket={socket} />} />
          </Route>
        </Routes>
      </main>
    </div>
  );
};

export default App;
