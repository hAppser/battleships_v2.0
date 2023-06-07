import { useEffect, useState } from "react";
import { Board } from "../../models/Board";
import BoardComponent from "../Board/BoardComponent";
import { useNavigate, useParams } from "react-router-dom";
import ActionsInfo from "../ActionsInfo/ActionsInfo";
const GamePage = ({ socket }: any) => {
  const navigate = useNavigate();
  const gameId = useParams().gameId;
  const [myBoard, setMyBoard] = useState(new Board());
  const [rivalBoard, setRivalBoard] = useState(new Board());
  const [username, setUserName] = useState("");
  const [rivalName, setRivalName] = useState("");
  const [shipsReady, setShipsReady] = useState(false);
  const [canShoot, setCanShoot] = useState(false);
  const [rivalReady, setRivalReady] = useState(false);

  function restart() {
    const newMyBoard = new Board();
    const newRivalBoard = new Board();
    newMyBoard.initCells();
    newRivalBoard.initCells();
    setMyBoard(newMyBoard);
    setRivalBoard(newRivalBoard);
  }
  function shoot(x: number, y: number) {
    socket.send(
      JSON.stringify({
        event: "shoot",
        payload: { username: localStorage.username, x, y, gameId: gameId },
      })
    );
  }
  socket.onmessage = function (response: any) {
    const { type, payload } = JSON.parse(response.data);
    const { username, x, y, canStart, rivalName, success, message } = payload;
    switch (type) {
      case "connectToPlay":
        if (!success) {
          return navigate("/menu");
        }

        setUserName(localStorage.username);
        setRivalName(rivalName);
        break;
      case "readyToPlay":
        setRivalReady(true);
        if (payload.username === username && canStart && rivalReady) {
          setCanShoot(payload.canShoot);
        }
        break;
      case "afterShootByMe":
        if (username !== localStorage.username) {
          const isPerfectHit = myBoard.cells[y][x].mark?.name === "ship";
          changeBoardAfterShoot(myBoard, setMyBoard, x, y, isPerfectHit);
          socket.send(
            JSON.stringify({
              event: "checkShot",
              payload: { ...payload, isPerfectHit },
            })
          );
          if (!isPerfectHit) {
            setCanShoot(true);
          }
        }
        break;
      case "isPerfectHit":
        if (username === localStorage.username) {
          changeBoardAfterShoot(
            rivalBoard,
            setRivalBoard,
            x,
            y,
            payload.isPerfectHit
          );
          payload.isPerfectHit ? setCanShoot(true) : setCanShoot(false);
        }
        break;

      default:
        break;
    }
  };

  function changeBoardAfterShoot(
    board: Board,
    setBoard: any,
    x: number,
    y: number,
    isPerfectHit: boolean
  ) {
    isPerfectHit ? board.addDamage(x, y) : board.addMiss(x, y);
    if (board.cells[y][x].mark?.name !== "") {
      const newBoard = board.getCopyBoard();
      setBoard(newBoard);
    }
  }
  function ready() {
    socket.send(
      JSON.stringify({
        event: "ready",
        payload: {
          username: localStorage.username,
          gameId: gameId,
        },
      })
    );
    setShipsReady(true);
  }
  useEffect(() => {
    socket.onopen = () => {
      socket.send(
        JSON.stringify({
          event: "connect",
          payload: {
            username: localStorage.username,
            gameId: gameId,
            ready: false,
          },
        })
      );
    };
    setUserName(localStorage.username);
    restart();
  }, []);
  return (
    <div>
      <div className="boards-container">
        <p className="nick">{username ? username : localStorage.username}</p>
        <BoardComponent
          board={myBoard}
          isMyBoard
          shipsReady={shipsReady}
          setBoard={setMyBoard}
          canShoot={false}
        />
      </div>
      <ActionsInfo ready={ready} canShoot={canShoot} shipsReady={shipsReady} />
      <div className="boards-container">
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
