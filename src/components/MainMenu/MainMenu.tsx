import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MainMenu.css";

export default function MainMenu({ username, onLogin }: any) {
  const [gameId, setGameId]: any = useState("");
  const navigate = useNavigate();
  const test = (e: any) => {
    onLogin(localStorage.username);
    if (gameId) {
      navigate("/game/" + gameId);
    }
  };
  return (
    <form className="MainMenu" onSubmit={test}>
      <h1>
        Welcome to Battleship, {username ? username : localStorage.username}
      </h1>
      <div className="controleArea">
        <button
          type="submit"
          className="btn create-game "
          onClick={() => setGameId(Date.now())}
        >
          CREATE GAME
        </button>
        <div className="availableGames">
          <p>Game 1</p>
          <p>Game 2</p>
          <p>Game 3</p>
        </div>
      </div>
    </form>
  );
}
