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
    }

    const hasWinner = () => {
        for (const win of winConditions) {
            if (board[win[0]] === "" ||
                board[win[1]] === "" ||
                board[win[2]] === ""
            ) continue;

            if (board[win[0]] === board[win[1]] &&
                board[win[0]] === board[win[2]]
            ) {
                return true;
            }
        }
        return false;
    }

    return {isDraw, hasWinner };
}

const Game = function(createPlayer, Gameboard, winChecker) {
    let player1;
    let player2;
    let currentPlayer;
    let gameOver = false;
    let gameStarted = false;

    const {isDraw, hasWinner} = winChecker(Gameboard);
 
    const getCurrentPlayer = () => currentPlayer;
    const setCurrentPlayer = () => { currentPlayer === player1 ? currentPlayer = player2 : currentPlayer = player1; };

    const startGame = (name1, name2) => {
        Gameboard.resetBoard();
        player1 = createPlayer(name1, "X");
        player2 = createPlayer(name2, "O");
        currentPlayer = player1;
        gameOver = false;
        gameStarted = true;
    }

    const resetGame = () => {
        Gameboard.resetBoard();
        currentPlayer = player1;
        gameOver = false;
    };

    const playRound = (position) => {
        if (!gameStarted || gameOver) return false;
        if (!Gameboard.setMarker(position, getCurrentPlayer().marker)) return false;
        
        if (hasWinner()) {
            gameOver = true;
            currentPlayer.setScore();
            return "win";
        };

        if (isDraw()) {
            gameOver = true;
            return "draw";
        };

        setCurrentPlayer();
        return "continue";
};

    return {getCurrentPlayer, startGame, resetGame, playRound};
};

const game1 = Game(createPlayer, Gameboard, winChecker);

const displayController = function() {
    const cells = document.querySelectorAll(".grid div");
    const status = document.querySelector(".game-status");
    const resetBtn = document.querySelector(".reset-btn");
    const form = document.querySelector("form");

    const showBoard = () => {
        const board = Gameboard.getBoard();

        cells.forEach((cell, i) => {
            cell.textContent = "";
            const img = document.createElement("img");

            if (board[i] === "") return;

            if (board[i] === "X") {
                img.src = "icons/cross.svg";
                img.classList.add("cross-icon");
            };

            if (board[i] === "O") {
                img.src = "icons/circle.svg";
                img.classList.add("circle-icon");
            };

            cell.appendChild(img);
        });
    };

    cells.forEach((cell, i) => {
        cell.addEventListener("click", () => {
            const result = game1.playRound(i);
            if (!result) return;
            showBoard();

            if (result === "win") {
                status.textContent = `${game1.getCurrentPlayer().name} hat gewonnen!`;
            };
            
            if (result === "draw") {
                status.textContent = "Draw!";
            };
        });
    });

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const name1 = formData.get("player1");
        const name2 = formData.get("player2");
        game1.startGame(name1, name2);
        form.reset();

        status.textContent = "";
        showBoard();

    });

    resetBtn.addEventListener("click", () => {
        game1.resetGame();

        status.textContent = "";
        showBoard();
    });

};

displayController();