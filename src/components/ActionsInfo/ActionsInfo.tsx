const ActionsInfo = ({ shipsReady = false, canShoot = false, ready }: any) => {
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
      {canShoot ? <p>Стреляй</p> : <p>Действие соперника</p>}
    </div>
  );
};
export default ActionsInfo;
