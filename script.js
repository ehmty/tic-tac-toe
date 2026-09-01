const createPlayer = function(name, marker) {
    let score = 0;
    const getScore = () => score;
    const setScore = () => { score++; };
    return {name, marker, getScore, setScore};
};

const Gameboard = (() => {
    const board = ["","x","","","","","","",""];
    const getBoard = () => board;
    const setMarker = (position, marker) => {
        if (board[position] !== "" || position > 8) return;
        board[position] = marker;
    };

    return {getBoard, setMarker };
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

    let currentPlayer = player1;
    const getCurrentPlayer = () => currentPlayer;
    const setCurrentPlayer = () => { currentPlayer === player1 ? currentPlayer = player2 : currentPlayer = player1; };

    return {player1, player2, getCurrentPlayer, setCurrentPlayer, isDraw, hasWinner};
};

const game1 = Game(createPlayer, Gameboard, winChecker);

const displayController = function() {
    let currentPlayer = game1.getCurrentPlayer();
    const board = Gameboard.getBoard();
    const grid = document.querySelectorAll(".grid div");
    grid.forEach((div, i) => {
        div.textContent = board[i];
    });
};

displayController();