const BoardComponent: any = ({
  board,
  setBoard,
  shipsReady,
  isMyBoard,
  canShoot,
  shoot,
}: any) => {
  const boardClasses: string[] = ["board"];
  console.log(board);
  if (canShoot) {
    boardClasses.push("active-shoot");
  }
  return <div className={boardClasses.join(" ")}></div>;
};
export default BoardComponent;
