const ActionsInfo = ({ shipsReady = false, canShoot = false, ready }: any) => {
  if (!shipsReady) {
    return (
      <button className="btn-ready" onClick={ready}>
        Корабли готовы
      </button>
    );
  }
  return <div>{canShoot ? <p>Стреляй</p> : <p>Выстрел соперника</p>}</div>;
};
export default ActionsInfo;
