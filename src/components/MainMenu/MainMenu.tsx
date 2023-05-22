import "./MainMenu.css";
export default function MainMenu({ username }: any) {
  return (
    <div className="MainMenu">
      <h1>Welcome to Battleship, {username}</h1>
      <div className="controleArea">
        <button className="btn">CREATE GAME</button>
        <div className="availableGames">
          <p>Game 1</p>
          <p>Game 2</p>
          <p>Game 3</p>
        </div>
      </div>
    </div>
  );
}
