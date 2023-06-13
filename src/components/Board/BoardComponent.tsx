import React from "react";
import CellComponent from "../Cell/CellComponent";
import { Cell } from "../../models/Cell";
import { useAppSelector } from "../../hooks/redux";
import useButtonDelay from "../../hooks/useButtonDelay";
const BoardComponent = ({ board, setBoard, isMyBoard, shoot }: any) => {
  const boardClasses: string[] = ["board"];
  const [handleClick, isDelayed] = useButtonDelay(700);

  const { shipsReady, canShoot, rivalReady } = useAppSelector(
    (state) => state.gameReducer
  );
  function addMark(x: number, y: number) {
    if (canShoot && !isMyBoard) {
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
      {isMyBoard && !shipsReady ? (
        <button
          className="btn-generate-ships"
          onClick={() => {
            // handleClick();
            board.addShipRandomly();
            updateBoard();
          }}
          disabled={isDelayed}
        >
          Generate random
        </button>
      ) : null}
      <div className={boardClasses.join(" ")}>
        {board.cells.map((row: [], index: number) => {
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
