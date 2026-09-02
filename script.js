const createPlayer = function(name, marker) {
    let score = 0;
    const getScore = () => score;
    const setScore = () => { score++; };
    return {name, marker, getScore, setScore};
};

const Gameboard = (() => {
    const board = ["","x","","","","","","",""];
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
    const player1 = createPlayer("p1", "x");
    const player2 = createPlayer("p2", "o");
    const {isDraw, hasWinner} = winChecker(Gameboard);
    let gameOver = false;

    let currentPlayer = player1;
    const getCurrentPlayer = () => currentPlayer;
    const setCurrentPlayer = () => { currentPlayer === player1 ? currentPlayer = player2 : currentPlayer = player1; };

    const resetGame = () => {
        Gameboard.resetBoard();
        gameOver = false;
        currentPlayer = player1;
        para.textContent = "";
        displayController();
    };

    const para = document.querySelector("p");
    const cells = document.querySelectorAll(".grid div");
    cells.forEach((cell, i) => cell.addEventListener("click", () => {
        if (gameOver) return;
        if (!Gameboard.setMarker(i, getCurrentPlayer().marker)) return;

        displayController();
        
        if (hasWinner()) {
            gameOver = true;
            para.textContent = `${currentPlayer.name} hat gewonnen!`;
            currentPlayer.setScore();
            return;
        };

        if (isDraw()) {
            gameOver = true;
            para.textContent = `Draw!`;
            return;
        };

        setCurrentPlayer();
    }));

    const resetBtn = document.querySelector(".reset-btn");
    resetBtn.addEventListener("click", () => resetGame());

    return {player1, player2, getCurrentPlayer, setCurrentPlayer, isDraw, hasWinner};
};

const game1 = Game(createPlayer, Gameboard, winChecker);

const displayController = function() {
    const board = Gameboard.getBoard();
    const cells = document.querySelectorAll(".grid div");
    cells.forEach((cell, i) => {
        cell.textContent = board[i];
    });
};