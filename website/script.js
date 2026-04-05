const board = document.getElementById("board");
const statusText = document.getElementById("status");

let currentPlayer = "X";
let cells = Array(9).fill("");

function createBoard() {
    board.innerHTML = "";
    cells.forEach((cell, index) => {
        const div = document.createElement("div");
        div.classList.add("cell");
        div.innerText = cell;
        div.addEventListener("click", () => makeMove(index));
        board.appendChild(div);
    });
}

function makeMove(index) {
    if (cells[index] !== "") return;

    cells[index] = currentPlayer;
    currentPlayer = currentPlayer === "X" ? "O" : "X";

    checkWinner();
    createBoard();
}

function checkWinner() {
    const wins = [
        [0,1,2],[3,4,5],[6,7,8],
        [0,3,6],[1,4,7],[2,5,8],
        [0,4,8],[2,4,6]
    ];

    for (let combo of wins) {
        let [a, b, c] = combo;
        if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) {
            statusText.innerText = cells[a] + " Wins!";
            cells = Array(9).fill("");
        }
    }
}

function restartGame() {
    cells = Array(9).fill("");
    currentPlayer = "X";
    statusText.innerText = "";
    createBoard();
}

createBoard();