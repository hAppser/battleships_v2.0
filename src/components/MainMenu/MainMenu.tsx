import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MainMenu.css";

export default function MainMenu({ username }: any) {
  const [gameId, setGameId]: any = useState("");
  const navigate = useNavigate();

  return (
    <div className="MainMenu">
      <h1>
        Welcome to Battleship, {username ? username : localStorage.username}
      </h1>
      <div className="controleArea">
        <button
          className="btn create-game "
          onClick={() => {
            setGameId(Date.now());
            if (gameId) {
              navigate("/game/" + gameId);
            }
          }}
        >
          CREATE GAME
        </button>
        <div className="availableGames">
          <p>Game 1</p>
          <p>Game 2</p>
          <p>Game 3</p>
        </div>
      </div>
    </div>
  );
}
