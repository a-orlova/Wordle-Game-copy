import { useState } from "react"
import { clsx } from "clsx"
import { getFarewellText, getRandomWord } from "./utils"
import Confetti from "react-confetti"


export default function AssemblyEndgame() {

    const [currentWord, setCurrentWord] = useState(() => getRandomWord())
    const [guessedLetters, setGuessedLetters] = useState([])

    const maxLives = 6
    const wrongGuessCount =
        guessedLetters.filter(letter => !currentWord.includes(letter)).length
    const livesLeft = maxLives - wrongGuessCount
    const isGameWon =
        currentWord.split("").every(letter => guessedLetters.includes(letter))
    const isGameLost = wrongGuessCount >= maxLives
    const isGameOver = isGameWon || isGameLost
    const lastGuessedLetter = guessedLetters[guessedLetters.length - 1]
    const isLastGuessIncorrect = lastGuessedLetter && !currentWord.includes(lastGuessedLetter)

    const alphabet = "абвгдеёжзийклмнопрстуфхцчшщъыьэюя"

    function addGuessedLetter(letter) {
        setGuessedLetters(prevLetters =>
            prevLetters.includes(letter) ?
                prevLetters :
                [...prevLetters, letter]
        )
    }

    function startNewGame() {
        setCurrentWord(getRandomWord())
        setGuessedLetters([])
    }

    const heartElements = Array.from({ length: maxLives }).map((_, index) => {
    const isLost = index >= livesLeft

    return (
        <span
            key={index}
            className={clsx("heart", isLost && "lost")}
        >
            {isLost ? "🖤" : "❤️"}
        </span>
    )
})

    const letterElements = currentWord.split("").map((letter, index) => {
        const shouldRevealLetter = isGameLost || guessedLetters.includes(letter)
        const letterClassName = clsx(
            isGameLost && !guessedLetters.includes(letter) && "missed-letter"
        )
        return (
            <span key={index} className={letterClassName}>
                {shouldRevealLetter ? letter.toUpperCase() : ""}
            </span>
        )
    })

    const keyboardElements = alphabet.split("").map(letter => {
        const isGuessed = guessedLetters.includes(letter)
        const isCorrect = isGuessed && currentWord.includes(letter)
        const isWrong = isGuessed && !currentWord.includes(letter)
        const className = clsx({
            correct: isCorrect,
            wrong: isWrong
        })

        return (
            <button
                className={className}
                key={letter}
                disabled={isGameOver}
                aria-disabled={guessedLetters.includes(letter)}
                aria-label={`Letter ${letter}`}
                onClick={() => addGuessedLetter(letter)}
            >
                {letter.toUpperCase()}
            </button>
        )
    })

    const gameStatusClass = clsx("game-status", {
        won: isGameWon,
        lost: isGameLost,
        farewell: !isGameOver && isLastGuessIncorrect
    })

    function renderGameStatus() {
        if (!isGameOver && isLastGuessIncorrect) {
            return (
                <p className="farewell-message">
                    {getFarewellText()}
                </p>
            )
        }

        if (isGameWon) {
            return (
                <>
                    <h2>Победа!</h2>
                    <p>Ты молодец! 🎉</p>
                </>
            )
        }
        if (isGameLost) {
            return (
                <>
                    <h2>Игра окончена!</h2>
                    <p>Попробуй еще раз!</p>
                </>
            )
        }

        return null
    }

    return (
        <main>
            {
                isGameWon && 
                    <Confetti
                        recycle={false}
                        numberOfPieces={1000}
                    />
            }
            <header>
                <h1>Угадай слово</h1>
                <p>Попробуй угадать слово за 6 попыток!</p>
            </header>

            <section
                aria-live="polite"
                role="status"
                className={gameStatusClass}
            >
                {renderGameStatus()}
            </section>

            <section className="lives">
                {heartElements}
            </section>

            <section className="word">
                {letterElements}
            </section>

            <section
                className="sr-only"
                aria-live="polite"
                role="status"
            >
                <p>
                    {currentWord.includes(lastGuessedLetter) ?
                        `Верно! Буква ${lastGuessedLetter} присутствует в слове.` :
                        `Извини, но буквы ${lastGuessedLetter} в слове нет.`
                    }
                    У тебя осталось {livesLeft} попыток.
                </p>
                <p>Текущее слово: {currentWord.split("").map(letter =>
                    guessedLetters.includes(letter) ? letter + "." : "blank.")
                    .join(" ")}</p>

            </section>

            <section className="keyboard">
                {keyboardElements}
            </section>

            {isGameOver &&
                <button
                    className="new-game"
                    onClick={startNewGame}
                >Новая игра</button>}
        </main>
    )
}
