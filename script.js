const createPlayer = function(name, marker) {
    let score = 0;
    const getScore = () => score;
    const setScore = () => { score++; };
    return {name, marker, getScore, setScore};
};

const Gameboard = (() => {
    const board = ["","","","","","","","",""];
    const getBoard = () => board;
    const resetBoard = () => board.fill("");
    const setMarker = (position, marker) => {
        if (board[position] !== "" || position > 8) return false;
        board[position] = marker;
        return true;
    };

    return {getBoard, setMarker, resetBoard};
})();

const winChecker = function(Gameboard) {
    const board = Gameboard.getBoard();
    const winConditions = [[0,1,2],[3,4,5],[6,7,8],
                           [0,3,6],[1,4,7],[2,5,8],
                           [0,4,8],[2,4,6]
                    ];

    const isDraw = () => {
        return !board.includes("") && !hasWinner();
    };

    const hasWinner = () => {
        for (const win of winConditions) {
            if (board[win[0]] === "" ||
                board[win[1]] === "" ||
                board[win[2]] === ""
            ) continue;

            if (board[win[0]] === board[win[1]] &&
                board[win[0]] === board[win[2]]
            ) {
                return win;
            }
        }
        return false;
    };

    return {isDraw, hasWinner };
};

const Game = function(createPlayer, Gameboard, winChecker) {
    let player1;
    let player2;
    let currentPlayer;
    let gameOver = false;
    let gameStarted = false;

    const {isDraw, hasWinner} = winChecker(Gameboard);
 
    const getCurrentPlayer = () => currentPlayer;
    const setCurrentPlayer = () => { 
        currentPlayer = currentPlayer === player1 ? player2 : player1;
    };

    const startGame = (name1, name2) => {
        Gameboard.resetBoard();
        player1 = createPlayer(name1, "X");
        player2 = createPlayer(name2, "O");
        currentPlayer = player1;
        gameOver = false;
        gameStarted = true;
    };

    const resetGame = () => {
        Gameboard.resetBoard();
        currentPlayer = player1;
        gameOver = false;
    };

    const playRound = (position) => {
        if (!gameStarted || gameOver) return false;
        if (!Gameboard.setMarker(position, getCurrentPlayer().marker)) return false;

        const winCondition = hasWinner();
        if (winCondition) {
            gameOver = true;
            currentPlayer.setScore();
            return winCondition;
        }

        if (isDraw()) {
            gameOver = true;
            return "draw";
        }

        setCurrentPlayer();
        return "continue";
    };

    return {getCurrentPlayer, startGame, resetGame, playRound};
};

const game1 = Game(createPlayer, Gameboard, winChecker);

const displayController = (() => {
    const cells = document.querySelectorAll(".grid div");
    const status = document.querySelector(".game-status");
    const resetBtn = document.querySelector(".reset-btn");
    const form = document.querySelector("form");
    const player1Name = document.querySelector(".player1-name");
    const player2Name = document.querySelector(".player2-name");
    const player1Score = document.querySelector(".player1-score");
    const player2Score = document.querySelector(".player2-score");

    const showBoard = () => {
        const board = Gameboard.getBoard();

        cells.forEach((cell, i) => {
            cell.textContent = "";
            const img = document.createElement("img");

            if (board[i] === "") return;

            if (board[i] === "X") {
                img.src = "icons/cross.svg";
                img.classList.add("cross-icon");
            }

            if (board[i] === "O") {
                img.src = "icons/circle.svg";
                img.classList.add("circle-icon");
            }

            cell.appendChild(img);
        });
    };

    cells.forEach((cell, i) => {
        cell.addEventListener("click", () => {
            const result = game1.playRound(i);
            
            if (!result) return;
            showBoard();

            if (result !== "draw" && result !== "continue") {
                for (const i of result) {
                    cells[i].classList.add("win-color");
                }
                
                const winner = game1.getCurrentPlayer();
                const score = winner.getScore();

                status.textContent = `${winner.name} hat gewonnen!`;

                winner.marker === "X"
                ? player1Score.textContent = score 
                : player2Score.textContent = score;
            }
            
            if (result === "draw") {
                status.textContent = "Draw!";
            }
        });
    });

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const name1 = formData.get("player1");
        const name2 = formData.get("player2");

        game1.startGame(name1, name2);
        form.reset();

        player1Name.textContent = name1;
        player2Name.textContent = name2;

        status.textContent = "";
        player1Score.textContent = 0;
        player2Score.textContent = 0;

        cells.forEach((cell) => cell.classList.remove("win-color"));

        showBoard();
    });

    resetBtn.addEventListener("click", () => {
        game1.resetGame();
        form.reset();

        status.textContent = "";

        cells.forEach((cell) => cell.classList.remove("win-color"));

        showBoard();
    });

})();