// A Memory Game - Build a memory game that challenges users to match pairs of cards.
//  You can use HTML, CSS, and JavaScript to create a user interface that displays a grid of cards with hidden images.
//  When a user clicks on a card, the image is revealed, and they must find its matching pair. 
// You can also include features like a timer to keep track of how long it takes users to complete the game,
//  or a score system that awards points for each matched pair.

const selector = {
    boardContainer:  document.querySelector(".board-container"),
    board: document.querySelector(".board"),
    moves: document.querySelector(".moves"),
    timer: document.querySelector(".timer"),
    start: document.querySelector("button"),
    win: document.querySelector(".win"),
};

const state = {
    gameStarted: false,
    flippedCards: 0,
    totalFlips: 0,
    totalTime: 0,
    loop: null,
};

const shuffle = array => {
    const clonedArray = [...array]

    for (let index = clonedArray.length - 1; index > 0; index--) {
        const randomIndex = Math.floor(Math.random() * (index + 1))
        const original = clonedArray[index]

        clonedArray[index] = clonedArray[randomIndex]
        clonedArray[randomIndex] = original
    }
    return clonedArray
}

const pickRandom = (array, items) => {
    const clonedArray = [...array]
    const randomPicks = []

    for(let index = 0; index < items; index++) {
        const randomIndex = Math.floor(Math.random() *clonedArray.length)

        randomPicks.push(clonedArray[randomIndex])
        clonedArray.splice(randomIndex, 1)
    }

    return randomPicks
}



const generateGame = () => {

    const dimensions = selector.board.getAttribute("data-dimension");

    if (dimensions % 2 !== 0) {
        throw new Error("The dimension of the board must be an even number")
    }

    const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
    const picks = pickRandom(numbers, (dimensions * dimensions) / 2);
    const items = shuffle([...picks, ...picks]);
    const cards = `
        <div class="board" style="grid-template-columns: repeat(${dimensions}, auto)">
            ${items.map(item => `
                <div class="card">
                    <div class="card-front"></div>
                    <div class="card-back">${item}</div>
                </div>
            `).join("")}
        </div>
    `

    const parser = new DOMParser().parseFromString(cards, "text/html")

    selector.board.replaceWith(parser.querySelector(".board"))
};

const startGame = () => {
    state.gameStarted = true
    selector.start.classList.add("disabled")

    state.loop = setInterval(() => {
        state.totalTime++

        selector.moves.innerHTML = `${state.totalFlips} moves`
        selector.timer.innerHTML = `time: ${state.totalTime}`
    }, 1000)
}

const flipBackCards = () => {
    document.querySelectorAll(".card:not(.matched)").forEach(card => {
        card.classList.remove("flipped")
    })
    state.flippedCards = 0
}


const flipCard = card => {
    state.flippedCards++
    state.totalFlips++

    if (!state.gameStarted) {
        startGame()
    }

    if (state.flippedCards <= 2 ) {
        card.classList.add("flipped")
    }

    if (state.flippedCards === 2) {
        const flippedCards = document.querySelectorAll(".flipped:not(.matched)")

        if (flippedCards[0].innerHTML === flippedCards[1].innerHTML) {
            flippedCards[0].classList.add("matched")
            flippedCards[1].classList.add("matched")
        }

        setTimeout(() => {
            flipBackCards()
        }, 1000)
    }

    if (!document.querySelectorAll(".card:not(.flipped)").length) {
        setTimeout(() => {
            selector.boardContainer.classList.add("flipped")
            selector.win.innerHTML = `
                <span class="win-text">
                    You won!<br/>
                    with <span class="highlight">${state.totalFlips}</span> mover <br/>
                    under <span class="highlight">${state.totalTime}</span> seconds

                </span>
            `

            clearInterval(state.loop)
        }, 1000)
    }
}

const attachEventListeners = () => {
    document.addEventListener("click", event => {
        const eventTarget = event.target
        const eventParent = eventTarget.parentElement

        if ( eventTarget.className.includes("card") && !eventParent.className.includes("flipped")) {
            flipCard(eventParent)
        } else if (eventTarget.nodeName === "BUTTON" && !eventTarget.className.includes("disabled")) {
            startGame()
        }
    })
}

generateGame();
attachEventListeners();