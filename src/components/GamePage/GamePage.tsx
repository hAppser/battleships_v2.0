import { useEffect, useState } from "react";
import { Board } from "../../models/board";
import BoardComponent from "../Board/BoardComponent";
const GamePage = () => {
  const [myBoard, setMyBoard] = useState(new Board());
  const [rivalBoard, setRivalBoard] = useState(new Board());
  const [username, setUserName] = useState("");
  const [rivalName, setRivalName] = useState("");
  const [shipsReady, setShipsReady] = useState(false);
  const [canShoot, setCanShoot] = useState(false);
  function restart() {
    const newMyBoard = new Board();
    const newRivalBoard = new Board();
    newMyBoard.initCells();
    newRivalBoard.initCells();
    setMyBoard(newMyBoard);
    setRivalBoard(newRivalBoard);
  }
  function shoot(x: number, y: number) {}
  useEffect(() => {
    restart();
  }, []);
  return (
    <div>
      <p>GAME!</p>
      <div className="boards-container">
        <div>
          <p className="nick">{username}</p>
          <BoardComponent
            board={myBoard}
            isMyBoard
            shipsReady={shipsReady}
            setBoard={setMyBoard}
            canShoot={false}
          />
        </div>
      </div>
      <div>
        <p className="nick">{rivalName || "Ожидание соперника"}</p>
        <BoardComponent
          board={rivalBoard}
          setBoard={setRivalBoard}
          canShoot={canShoot}
          shipsReady={shipsReady}
          shoot={shoot}
        />
      </div>
    </div>
  );
};
export default GamePage;
