import React from "react";
import CellComponent from "../Cell/CellComponent";
import { Cell } from "../../models/Cell";
import { useAppSelector } from "../../hooks/redux";

const BoardComponent: any = ({ board, setBoard, isMyBoard, shoot }: any) => {
  const boardClasses: string[] = ["board"];
  const { shipsReady, canShoot, rivalReady } = useAppSelector(
    (state) => state.gameReducer
  );
  function addMark(x: number, y: number) {
    if (!shipsReady && isMyBoard) {
      board.addShip(x, y);
    } else if (canShoot && !isMyBoard) {
      shoot(x, y);
    }
    updateBoard();
  }
  function updateBoard() {
    const newBoard = board.getCopyBoard();

    setBoard(newBoard);
  }
  if (canShoot) {
    boardClasses.push("active-shoot");
  }
  return (
    <div>
      {isMyBoard ? (
        <button
          className="btn-generate-ships"
          onClick={() => {
            board.getNewBoard();
            board.addShipRandomly();
            updateBoard();
          }}
        >
          Generate random
        </button>
      ) : null}
      <div className={boardClasses.join(" ")}>
        {board.cells.map((row: any, index: number) => {
          return (
            <React.Fragment key={index}>
              {row.map((cell: Cell) => {
                return (
                  <CellComponent key={cell.id} cell={cell} addMark={addMark} />
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
