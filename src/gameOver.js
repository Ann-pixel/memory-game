import "./gameOver.css";
export default function GameOver(props) {
  return (
    <div className="overlay">
      <div className="game-over">
        <h3>Game over</h3>
        <h4>score: {props.score}</h4>
        <p>Click to reset the game</p>
        <div className="reset" onClick={props.reset}>
          Reset
        </div>
      </div>
    </div>
  );
}
