const createPlayer = function(name, marker) {
    let score = 0;
    const getScore = () => score;
    const setScore = () => { score++; };
    return {name, marker, getScore, setScore};
};

const Gameboard = (() => {
    const board = ["","","","","","","","",""];
    const getBoard = () => board;
    return {getBoard };
})();

const winChecker = function(Gameboard) {
    winConditions = [[0,1,2],[3,4,5],[6,7,8],
                     [0,3,6],[1,4,7],[2,5,8],
                     [0,4,8],[2,4,6]
                    ];
    const isDraw = () => {
        return !Gameboard.includes("") && !hasWinner();
    }

    const hasWinner = () => {
        for (const win of winConditions) {
            if (Gameboard[win[0]] === "" ||
                Gameboard[win[1]] === "" ||
                Gameboard[win[2]] === ""
            ) continue;

            if (Gameboard[win[0]] === Gameboard[win[1]] &&
                Gameboard[win[0]] === Gameboard[win[2]]
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
    const setCurrentPlayer = (playerObj) => { currentPlayer = playerObj };

    const setMarker = (position, player) => {
        if (Gameboard[position] !== "" || position > 8) return;
        Gameboard[position] = player.marker;
    };

    return {player1, player2, getCurrentPlayer, setCurrentPlayer, setMarker, isDraw, hasWinner};
};