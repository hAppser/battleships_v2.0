const CellComponent = ({ cell, addMark }: any) => {
  const cellClasses: string[] = ["cell"];
  cellClasses.push(cell?.mark?.color);
  return (
    <div
      className={cellClasses.join(" ")}
      onClick={() => addMark(cell.x, cell.y)}
    ></div>
  );
};
export default CellComponent;
