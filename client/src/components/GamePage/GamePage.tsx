/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
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
import { Board } from "../../models/Board";
import BoardComponent from "../Board/BoardComponent";
import ActionsInfo from "../ActionsInfo/ActionsInfo";
import Chat from "../Chat/Chat";

const GamePage = ({ socket }: any) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const newGameId = useParams().gameId;

  const { gameId, username, rivalName, rivalReady, myHealth, rivalHealth } =
    useAppSelector((state) => state.gameReducer);
  if (gameId === "") {
    dispatch(setGameId(newGameId));
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

        dispatch(setUsername(payload.username));
        dispatch(setRivalName(payload.rivalName));
        dispatch(setCanShoot(payload.canShoot));
        dispatch(setMyHealth(payload.myHealth));
        dispatch(setRivalHealth(payload.rivalHealth));
        break;
      case "getMessage":
        dispatch(setChat({ username, message }));
        break;
      case "readyToPlay":
        dispatch(setRivalReady(true));
        if (payload.username === username && canStart && rivalReady) {
          dispatch(setCanShoot(payload.canShoot));
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
            dispatch(setCanShoot(true));
          } else {
            dispatch(setMyHealth(myHealth - 1));
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
            dispatch(setCanShoot(false));
          } else {
            dispatch(setRivalHealth(rivalHealth - 1));
            dispatch(setCanShoot(true));
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
    dispatch(setShipsReady(true));
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
    restart();
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
