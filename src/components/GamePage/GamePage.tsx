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
  setMyHealth,
  setRivalHealth,
  setChat,
} from "../../store/reducers/gameSlice";

import BoardComponent from "../Board/BoardComponent";
import ActionsInfo from "../ActionsInfo/ActionsInfo";
import Chat from "../Chat/Chat";

const GamePage = ({ socket }: any) => {
  const dispath = useAppDispatch();
  const navigate = useNavigate();
  const newGameId = useParams().gameId;
  const { gameId, username, rivalName, rivalReady, myHealth, rivalHealth } =
    useAppSelector((state) => state.gameReducer);
  if (gameId === "") {
    dispath(setGameId(newGameId));
  }
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
    console.log(`${myHealth}, ${rivalHealth}`);
    socket.send(
      JSON.stringify({
        event: "shoot",
        payload: { username, x, y, gameId },
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
      case "getMessage":
        dispath(setChat({ username, message }));
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
          } else {
            dispath(setMyHealth(myHealth - 1));
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
          if (!payload.isPerfectHit) {
            dispath(setCanShoot(false));
          } else {
            dispath(setRivalHealth(rivalHealth - 1));
            dispath(setCanShoot(true));
          }
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
          username,
          gameId,
          ready: true,
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
          },
        })
      );
    };
    restart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="GamePage">
      <div className="boards-container">
        <p className="nick">{username}</p>
        <BoardComponent board={myBoard} setBoard={setMyBoard} isMyBoard />
      </div>
      <ActionsInfo ready={ready} />
      <div className="boards-container">
        <p className="nick">{rivalName || "Ожидание соперника"}</p>
        <BoardComponent
          board={rivalBoard}
          setBoard={setRivalBoard}
          shoot={shoot}
        />
      </div>
      <Chat socket={socket} />
    </div>
  );
};
export default GamePage;
