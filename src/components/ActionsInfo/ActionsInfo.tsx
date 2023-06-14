import { useAppSelector } from "../../hooks/redux";

const ActionsInfo = ({ ready }: any) => {
  const { shipsReady, canShoot, shipsPlaced, myHealth, rivalHealth } =
    useAppSelector((state) => state.gameReducer);
  if (!shipsReady) {
    return (
      <div className="ActionsInfo">
        <button className="btn-ready" onClick={ready} disabled={!shipsPlaced}>
          Корабли готовы
        </button>
      </div>
    );
  }
  return (
    <div className="ActionsInfo">
      {myHealth === 0 ? (
        <p>Вы проиграли!</p>
      ) : rivalHealth === 0 ? (
        <p>Вы победили!</p>
      ) : canShoot ? (
        <p>Стреляй</p>
      ) : (
        <p>Действие соперника</p>
      )}
    </div>
  );
};
export default ActionsInfo;
