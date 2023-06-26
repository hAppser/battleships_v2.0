import { useAppSelector } from "../../hooks/redux";
import "./ActionsInfo.css";
const ActionsInfo = ({ ready }: any) => {
  const { shipsReady, canShoot, shipsPlaced, myHealth, rivalHealth } =
    useAppSelector((state) => state.gameReducer);
  return (
    <div className="ActionsInfo">
      {!shipsReady ? (
        <button className="btn-ready" onClick={ready} disabled={!shipsPlaced}>
          Корабли готовы
        </button>
      ) : (
        <>
          {myHealth === 0 ? (
            <p>Вы проиграли!</p>
          ) : rivalHealth === 0 ? (
            <p>Вы победили!</p>
          ) : canShoot ? (
            <p>Стреляй</p>
          ) : (
            <p>Действие соперника</p>
          )}
        </>
      )}
    </div>
  );
};
export default ActionsInfo;
