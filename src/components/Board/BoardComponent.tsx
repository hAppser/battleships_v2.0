import React from "react";
import CellComponent from "../Cell/CellComponent";
import { Cell } from "../../models/cell";

const BoardComponent: any = ({
  board,
  setBoard,
  shipsReady,
  isMyBoard,
  canShoot,
  shoot,
}: any) => {
  const boardClasses: string[] = ["board"];
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
  );
};
export default BoardComponent;
