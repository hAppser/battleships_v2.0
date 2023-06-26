import { useNavigate } from "react-router-dom";
import { setGameId } from "../../store/reducers/gameSlice";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";

import "./MainMenu.css";
export default function MainMenu({ socket }: any) {
  const dispath = useAppDispatch();
  const navigate = useNavigate();
  const { username, gameId } = useAppSelector((state) => state.gameReducer);
  const createGame = () => {
    if (gameId) {
      navigate("/game/" + gameId);
    }
  };
  return (
    <form className="MainMenu" onSubmit={createGame}>
      <h1>Welcome to Battleship, {username} </h1>
      <div className="controleArea">
        <button
          type="submit"
          className="btn create-game "
          onClick={() => dispath(setGameId(Date.now()))}
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
