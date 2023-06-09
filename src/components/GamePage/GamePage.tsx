import { useEffect, useState } from "react";
import { Board } from "../../models/Board";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  setUsername,
  setRivalName,
  setShipsReady,
  setCanShoot,
  setRivalReady,
  setGameId,
} from "../../store/reducers/gameSlice";

import BoardComponent from "../Board/BoardComponent";
import ActionsInfo from "../ActionsInfo/ActionsInfo";

const GamePage = ({ socket }: any) => {
  const dispath = useAppDispatch();
  const navigate = useNavigate();
  const { gameId, username, rivalName, shipsReady, canShoot, rivalReady } =
    useAppSelector((state) => state.gameReducer);
  const [myBoard, setMyBoard] = useState(new Board());
  const [rivalBoard, setRivalBoard] = useState(new Board());
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

        dispath(setUsername(localStorage.username));
        dispath(setRivalName(rivalName));
        break;
      case "readyToPlay":
        dispath(setRivalReady(true));
        if (payload.username === username && canStart && rivalReady) {
          dispath(setCanShoot(payload.canShoot));
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
            dispath(setCanShoot(true));
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
          payload.isPerfectHit
            ? dispath(setCanShoot(true))
            : dispath(setCanShoot(false));
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
    dispath(setShipsReady(true));
  }
  useEffect(() => {
    socket.onopen = () => {
      socket.send(
        JSON.stringify({
          event: "connect",
          payload: {
            username: username,
            gameId: gameId,
            ready: false,
          },
        })
      );
    };
    // dispath(setUsername(localStorage.username));
    restart();
  }, []);
  return (
    <div>
      <div className="boards-container">
        <p className="nick">{username}</p>
        <BoardComponent
          board={myBoard}
          setBoard={setMyBoard}
          isMyBoard
          // shipsReady={shipsReady}
          // canShoot={false}
        />
      </div>
      <ActionsInfo ready={ready} canShoot={canShoot} shipsReady={shipsReady} />
      <div className="boards-container">
        <p className="nick">{rivalName || "Ожидание соперника"}</p>
        <BoardComponent
          board={rivalBoard}
          setBoard={setRivalBoard}
          shoot={shoot}
          // canShoot={canShoot}
          // shipsReady={shipsReady}
        />
      </div>
    </div>
  );
};
export default GamePage;
