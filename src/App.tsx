import { useCallback, useEffect, useState } from "react"
import { HangmanDrawing } from "./HangmanDrawing"
import { HangmanWord } from "./HangmanWord"
import { Keyboard } from "./Keyboard"
import englishWords from "./wordList.json"
import bulgarianWords from "./wordListBg.json"
import { playWinSound, playLoseSound } from "./utils/sounds";

const colors = ["red", "blue", "green", "orange", "lilac", "red", "darkblue", "brown", "lightblue", "purple", "indigo", "pink"];
function getRandomColor() {
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
}

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
  // Effect to handle win/lose sounds
  useEffect(() => {
    if (isWinner) {
      playWinSound(); // Play win sound
      setScore((prevScore) => prevScore + 1); // Increase score
      setTimeout(resetGame, 2000);
    } else if (isLoser) {
      playLoseSound(); // Play lose sound
      setScore((prevScore) => prevScore - 1); // Increase score
      setTimeout(resetGame, 2000);
    }
  }, [isWinner, isLoser]);
  const resetGame = () => {
    const newWord = getWord();
    setWordToGuess(newWord);
    setWordToShow(bgWord);
    setBgWordColor(getRandomColor());
    setGuessedLetters([]);
  };
  return (
    <div
      style={{
        maxWidth: "800px",
        display: "flex",
        flexDirection: "column",
        gap: "0.6rem",
        margin: "0 auto",
        alignItems: "center",
        padding: "1rem"
      }}
    >
      <div style={{ color: bgWordColor, fontSize: "1.6rem" }}>{wordToShow}
        <button
          onClick={() => resetGame()}
          style={{
            marginInline: "10px",
            padding: "5px 10px",
            fontSize: "1.4rem",
            backgroundColor: "#ff6600",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            transition: "background-color 0.3s ease",
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#e65c00")}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#ff6600")}
        >
          Next
        </button>

        <span style={{ fontSize: "1rem", textAlign: "center" }}>
          {isWinner && "Winner!"}
          {isLoser && "Nice Try!"}
        </span>
      </div>

      <HangmanDrawing numberOfGuesses={incorrectLetters.length} />
      <HangmanWord
        reveal={isLoser}
        guessedLetters={guessedLetters}
        wordToGuess={wordToGuess}
      />
      <div style={{ fontSize: "1.2rem", position: "absolute", marginTop: "80px", marginLeft: "-200px" }}>
        <strong>Score: {score}</strong>
      </div> {/* Display the score */}
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
