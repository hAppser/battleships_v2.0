import { useAppSelector } from "../../hooks/redux";

const ActionsInfo = ({ ready }: any) => {
  const { shipsReady, canShoot, rivalReady } = useAppSelector(
    (state) => state.gameReducer
  );
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
