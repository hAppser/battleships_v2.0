const ActionsInfo = ({
  shipsReady = false,
  canShoot = false,
  ready,
  player,
}: any) => {
  if (!shipsReady) {
    return (
      <div className="ActionsInfo">
        <button className="btn-ready" onClick={ready}>
          Корабли готовы
        </button>
      </div>
    );
  }
  return (
    <div className="ActionsInfo">
      {canShoot ? <p>Стреляй</p> : <p>Выстрел соперника</p>}
    </div>
  );
};
export default ActionsInfo;
