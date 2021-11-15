import { useEffect, useState } from "react";
import "./App.css";
import Cards from "./Cards";
import { timeout } from "./utils";
import { allSounds, whaleSound } from "./utils";
import GameOver from "./gameOver";
function App() {
  const colorList = ["a", "b", "c", "d", "e", "f", "g", "h"];
  const initPlay = {
    isDisplay: false,
    displayPattern: [],
    score: 0,
    isUserPlay: false,
    userPattern: [],
  };
  const [isOn, setIsOn] = useState(false);
  const [game, setGame] = useState(initPlay);
  const [flashColor, setFlashColor] = useState("");
  const [isGameOver, setIsGameOver] = useState(false);
  // USER CLICKS START OR REPLAY
  function startHandle() {
    setIsOn(true);
  }
  function restartGame() {
    setIsGameOver(false);
    setGame(initPlay);
    setIsOn(false);
  }
  // play.isOn changed. Change isDisplay.
  useEffect(() => {
    if (isOn) {
      setGame({ ...initPlay, isDisplay: true });
    }
    // eslint-disable-next-line
  }, [isOn]);

  // isDisplay is true. Add a color to display pattern.
  useEffect(() => {
    if (isOn && game.isDisplay) {
      let newColor = colorList[Math.floor(Math.random() * 8)];
      const copyColors = [...game.displayPattern];
      copyColors.push(newColor);
      setGame({ ...game, displayPattern: copyColors });
    }
    // eslint-disable-next-line
  }, [isOn, game.isDisplay]);

  // display all colors from pattern
  useEffect(() => {
    if (isOn && game.isDisplay && game.displayPattern.length) {
      displayColors();
    }
    // eslint-disable-next-line
  }, [isOn, game.isDisplay, game.displayPattern.length]);

  async function displayColors() {
    await timeout(0.3);
    for (let i = 0; i < game.displayPattern.length; i++) {
      setFlashColor(game.displayPattern[i]);
      playSound(game.displayPattern[i]);
      await timeout(0.3);
      setFlashColor("");
      await timeout(0.5);

      if (i === game.displayPattern.length - 1) {
        const copyColors = [...game.displayPattern];
        setGame({
          ...game,
          isDisplay: false,
          isUserPlay: true,
          userPattern: copyColors.reverse(),
        });
      }
    }
  }
  // perform a check for the users pattern
  //
  async function cardClickHandle(color) {
    if (!game.isDisplay && game.isUserPlay) {
      const copyUserPattern = [...game.userPattern];
      const lastColor = copyUserPattern.pop();
      setFlashColor(color);
      playSound(color);
      if (color === lastColor) {
        if (copyUserPattern.length) {
          setGame({ ...game, userPattern: copyUserPattern });
        } else {
          await timeout(0.5);
          setGame({
            ...game,
            isDisplay: true,
            isUserPlay: false,
            score: game.displayPattern.length,
            userPattern: [],
          });
        }
      } else {
        await timeout(0.5);
        setGame({
          ...initPlay,
          score: game.displayPattern.length,
        });
        whaleSound.play();
        setIsGameOver(true);
      }
      await timeout(0.1);
      setFlashColor("");
    }
  }
  function playSound(color) {
    let idx = colorList.indexOf(color);
    allSounds[idx].play();
  }
  return (
    <div className="app">
      <div className="header">
        <div className="">Test your memory!</div>
        <div className="">----Hit START----</div>
      </div>
      <div className="card-wrapper">
        {colorList &&
          colorList.map((v, i) => (
            <Cards
              key={v}
              onClick={() => {
                cardClickHandle(v);
              }}
              flash={flashColor === v}
              color={v}
            />
          ))}
        {!isOn && !game.score && (
          <div className="btn" onClick={startHandle}>
            Start
          </div>
        )}
        {isOn && (game.isDisplay || game.isUserPlay) && (
          <div className="btn">{game.score}</div>
        )}
      </div>

      {isGameOver && <GameOver score={game.score} reset={restartGame} />}
      <div className="footer">Made with ♥ by Gauri</div>
    </div>
  );
}

export default App;
