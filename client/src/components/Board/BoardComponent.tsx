import React from "react";
import CellComponent from "../Cell/CellComponent";
import { Cell } from "../../models/Cell";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { setShipsPlaced } from "../../store/reducers/gameSlice";
const BoardComponent = ({ board, setBoard, isMyBoard, shoot }: any) => {
  const boardClasses: string[] = ["board"];

  const { shipsReady, canShoot, myHealth, rivalHealth } = useAppSelector(
    (state) => state.gameReducer
  );
  const dispath = useAppDispatch();

  function updateBoard() {
    const newBoard = board.getCopyBoard();

    setBoard(newBoard);
  }

  function addMark(x: number, y: number) {
    if (canShoot && !isMyBoard) {
      shoot(x, y);
    }
    updateBoard();
  }

  if (canShoot) {
    boardClasses.push("active-shoot");
  }
  return (
    <div>
      <button
        className={
          isMyBoard && !shipsReady
            ? "btn-generate-ships"
            : "btn-generate-ships hidden"
        }
        onClick={() => {
          board.addShipRandomly();
          updateBoard();
          dispath(setShipsPlaced(true));
        }}
      >
        Generate random
      </button>

      <div className={boardClasses.join(" ")}>
        {board.cells.map((row: [], index: number) => {
          return (
            <React.Fragment key={index}>
              {row.map((cell: Cell) => {
                return (
                  <CellComponent
                    key={cell.id}
                    cell={cell}
                    addMark={myHealth && rivalHealth ? addMark : () => {}}
                  />
                );
              })}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
export default BoardComponent;
