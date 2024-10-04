import { useCallback, useEffect, useState } from "react"
import './App.css';
import { HangmanDrawing } from "./HangmanDrawing"
import { HangmanWord } from "./HangmanWord"
import { Keyboard } from "./Keyboard"
import englishWords from "./wordList.json"
import bulgarianWords from "./wordListBg.json"
import { playWinSound, playLoseSound, playNextLevelSound, playFinishLevel1Sound, playFinishLevel2Sound } from "./utils/sounds";
import { getRandomImage } from "./utils/images";
import { getRandomColor } from "./utils/colors";



let bgWord = '';
let enWord = '';
let randomIndex = 1;
function getWord() {
  randomIndex = Math.floor(Math.random() * englishWords.length)
  bgWord = bulgarianWords[randomIndex]
  return englishWords[randomIndex]
}

function App() {
  const [wordToGuess, setWordToGuess] = useState(getWord)

  const [wordToShow, setWordToShow] = useState(bgWord)
  const [guessedLetters, setGuessedLetters] = useState<string[]>([])
  const [score, setScore] = useState(0);
  const [bgWordColor, setBgWordColor] = useState(getRandomColor());
  const [backgroundImage, setBackgroundImage] = useState(getRandomImage());
  const [level, setLevel] = useState(1);
  const incorrectLetters = guessedLetters.filter(
    letter => !wordToGuess.includes(letter)
  )

  const isLoser = incorrectLetters.length >= 6
  const isWinner = wordToGuess
    .split("")
    .every(letter => guessedLetters.includes(letter))

  const addGuessedLetter = useCallback(
    (letter: string) => {
      if (guessedLetters.includes(letter) || isLoser || isWinner) return

      setGuessedLetters(currentLetters => [...currentLetters, letter])
    },
    [guessedLetters, isWinner, isLoser]
  )

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const key = e.key
      if (!key.match(/^[a-z]$/)) return

      e.preventDefault()
      addGuessedLetter(key)
    }

    document.addEventListener("keypress", handler)

    return () => {
      document.removeEventListener("keypress", handler)
    }
  }, [guessedLetters])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const key = e.key
      if (key !== "Enter") return

      e.preventDefault()
      setGuessedLetters([])
      setWordToGuess(enWord)
    }

    document.addEventListener("keypress", handler)

    return () => {
      document.removeEventListener("keypress", handler)
    }
  }, [])
  useEffect(() => {
    if (isWinner) {
      if (score == 20 || score == 40 || score == 60) {
        playWinSound(); // Play win sound
      }
      setScore((prevScore) => prevScore + 1); // Increase score
      setTimeout(resetGame, 2000);
    } else if (isLoser) {
      playLoseSound(); // Play lose sound
      setScore((prevScore) => prevScore - 1); // Increase score
      setTimeout(resetGame, 2000);
    }
  }, [isWinner, isLoser]);
  useEffect(() => {
    if (score == 60) {
      playFinishLevel1Sound();
      playFinishLevel2Sound();
      setScore(0);
      setLevel(1);
      resetGame();
    } else if (score >= 40) {
      setLevel(3); // Level 3 starts at score 40
      if (score == 40) {
        playNextLevelSound();
      }
    } else if (score >= 20) {
      setLevel(2); // Level 2 starts at score 20
      if (score == 20) {
        playNextLevelSound()
      }
    }
  }, [score]);
  const resetGame = () => {
    const newWord = getWord();
    setWordToGuess(newWord);
    setWordToShow(bgWord);
    setBgWordColor(getRandomColor());
    setBackgroundImage(getRandomImage());
    setGuessedLetters([]);
  };
  return (
    <div
      className="container"
      style={{
        backgroundImage: `url(${backgroundImage})`,
      }}
    >
      <div style={{ color: bgWordColor, fontSize: "1.6rem" }}>{wordToShow}
        <button
          className="main-btn"
          onClick={() => resetGame()}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#e65c00")}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#ff6600")}
        >
          Next
        </button>

        <span style={{ fontSize: "1rem", textAlign: "center" }}>
          {isWinner && "Yes!"}
          {isLoser && "Nice Try!"}
        </span>
      </div>

      <HangmanDrawing numberOfGuesses={incorrectLetters.length} />
      <HangmanWord
        reveal={isLoser}
        guessedLetters={guessedLetters}
        wordToGuess={wordToGuess}
      />
      <div className="score">
        <strong>Score: {score}</strong>
      </div>
      <div className="level">
        <strong>Level: {level}</strong>
      </div>
      <div style={{ alignSelf: "stretch" }}>

        <Keyboard
          disabled={isWinner || isLoser}
          activeLetters={guessedLetters.filter(letter =>
            wordToGuess.includes(letter)
          )}
          inactiveLetters={incorrectLetters}
          addGuessedLetter={addGuessedLetter}
        />
      </div>
    </div >
  )
}

export default App
