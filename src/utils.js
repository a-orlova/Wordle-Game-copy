import { words } from "./words"

export function getRandomWord() {
    const randomIndex = Math.floor(Math.random() * words.length)
    return words[randomIndex]
}

export function getFarewellText() {
    const options = [
        "Почти!",
        "Ещё немного!",
        "Не сдавайся!",
        "Думай внимательнее",
        "Попробуй другую букву",
        "Хорошая попытка!",
        "Соберись!",
        "Ты справишься!"
    ]

    const randomIndex = Math.floor(Math.random() * options.length);
    return options[randomIndex];
}