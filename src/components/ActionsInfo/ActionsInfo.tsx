const ActionsInfo = ({ shipReady = false, canShoot = false, ready }: any) => {
  if (!shipReady) {
    return (
      <button className="btn-ready" onClick={ready}>
        Корабли готовы
      </button>
    );
  }
  return <div>{canShoot ? <p>Стреляй</p> : <p>Выстрел соперника</p>}</div>;
};
export default ActionsInfo;
