//GLOBAL VARIABLES

let rootX = 60, rootY = 45, boardSize = 9, boxSize = 50;
let player = 0;

const EMPTY = -1;
const CHECKED = 1, UNCHECKED = 0;

let directs = [
    [0, 1], [0, -1], [1, 0], [-1, 0]
];

//Current board
let board = [];
//Calculate liberties by checking each position
let checkBoard = [];
//Test valid move by checking the test board
let testBoard = [];
//Back up board
let backupBoard = [];

for (var i = 0; i < boardSize; i++) {
    board.push([]);
    checkBoard.push([]);
    testBoard.push([]);
    backupBoard.push([]);
    for (var j = 0; j < boardSize; j++) {
        board[i].push(EMPTY);
        checkBoard[i].push(UNCHECKED);
        testBoard[i].push(EMPTY);
        backupBoard[i].push(EMPTY);
    }
}

//FUNCTIONS
function calcFEN() {
    let fen_str = ""
    fen_str += board.join(",")
    fen_str += ","
    fen_str += checkBoard.join(',')
    fen_str += ","
    fen_str += testBoard.join(',')
    fen_str += ","
    fen_str += backupBoard.join(',')
    fen_str += ","
    fen_str += player.toString()
    console.log('CALC FEN')
    console.log(fen_str)

    console.log(board)
    console.log(checkBoard)
    console.log(testBoard)
    console.log(backupBoard)
    console.log(player)

    return fen_str
}

function useFEN(fen_str) {
    let fen_arr = fen_str.split(',')
    console.log('USE FEN')
    console.log(fen_arr)
    let fen_arr_idx = boardSize * boardSize

    for (var i = 0; i < boardSize; i++) {
        for (var j = 0; j < boardSize; j++) {
            board[i][j] = parseInt(fen_arr[fen_arr_idx * 0 + boardSize * i + j])
            checkBoard[i][j] = parseInt(fen_arr[fen_arr_idx * 1 + boardSize * i + j])
            testBoard[i][j] = parseInt(fen_arr[fen_arr_idx * 2 + boardSize * i + j])
            backupBoard[i][j] = parseInt(fen_arr[fen_arr_idx * 3 + boardSize * i + j])
        }
    }

    player = parseInt(fen_arr[fen_arr_idx * 4])
}


function getLiberties(board, x, y) {
    if (board[x][y] === EMPTY)
        return -1;
    if (checkBoard[x][y] === CHECKED)
        return 0;

    checkBoard[x][y] = CHECKED;

    var count = 0;

    for (var i = 0; i < directs.length; i++) {
        var pX = x + directs[i][0];
        var pY = y + directs[i][1];

        if (!outOfBounds(pX, pY)) { //valid position
            if (board[pX][pY] === EMPTY) { //1 liberty
                count++;
            } else if (board[pX][pY] === board[x][y]) { //next chain
                count += getLiberties(board, pX, pY);
                checkBoard[pX][pY] = CHECKED;
            }
        }

    }
    return count;
}

function getChain(x, y) {
    var chain = [];
    for (var i = 0; i < boardSize; i++) {
        for (var j = 0; j < boardSize; j++) {
            if (checkBoard[i][j] === CHECKED) {
                chain.push([i, j]);
            }
        }
    }
    return chain;
}

function clearBoard(board) {
    for (var i = 0; i < boardSize; i++) {
        for (var j = 0; j < boardSize; j++) {
            if (board[i][j] !== EMPTY && board[i][j] !== player) {
                if (getLiberties(board, i, j) === 0) {
                    //Remove dead pieces in board
                    var chain = getChain(i, j);
                    for (var k = 0; k < chain.length; k++) {
                        var pX = chain[k][0];
                        var pY = chain[k][1];

                        board[pX][pY] = EMPTY;
                    }
                }
                resetCheckBoard();
            }
        }
    }
}

//Update game by selected board
function updateGameBy(board) {
    deleteBox($('.box'));

    for (var i = 0; i < boardSize; i++) {
        for (var j = 0; j < boardSize; j++) {
            if (board[i][j] !== EMPTY) {
                var box = $('#box-' + i + '-' + j);

                box.addClass(board[i][j] === 0 ? 'black' : 'white');
                box.removeClass('hide');
            }
        }
    }
}

//Copy two board
function copyBoard(board, copyBoard) {
    for (var i = 0; i < boardSize; i++) {
        for (var j = 0; j < boardSize; j++) {
            board[i][j] = copyBoard[i][j];
        }
    }
}

//Check if board changed or not
//Compare test board to backup board
function invalidTestBoard() {
    for (var i = 0; i < boardSize; i++) {
        for (var j = 0; j < boardSize; j++) {
            if (testBoard[i][j] !== backupBoard[i][j]) {
                return false;
            }
        }
    }
    return true;
}

//Check if this move is valid
function invalidMove(x, y) {
    if (testBoard[x][y] !== EMPTY && getLiberties(testBoard, x, y) === 0) {
        return true;
    }
    resetCheckBoard();
    return false;
}

//Check valid position
function outOfBounds(x, y) {
    return x < 0 || x >= boardSize || y < 0 || y >= boardSize;
}

function resetCheckBoard() {
    for (var i = 0; i < boardSize; i++) {
        for (var j = 0; j < boardSize; j++) {
            checkBoard[i][j] = UNCHECKED;
        }
    }
}

//Reset board to start new game
function resetBoard(board) {
    for (var i = 0; i < boardSize; i++) {
        for (var j = 0; j < boardSize; j++) {
            board[i][j] = EMPTY;
        }
    }
}

function deleteBox(box) {
    box.removeClass('black');
    box.removeClass('white');
    box.addClass('hide');
}

function reset() {
    deleteBox($('.box'));

    player = 0;

    resetBoard(board);
    resetBoard(testBoard);
    resetBoard(backupBoard);
}

function showInvalidMove(x, y) {
    var box = $('#box-' + x + '-' + y);

    box.addClass('invalid');
    setTimeout(function () {
        box.removeClass('invalid');
    }, 50);
}

//Create grid board game
function createGrid() {
    $('.board').empty();

    for (var i = 0; i < boardSize; i++) {
        $('.board').append('<div class=\"rowgo\" id=\"row-' + i + '\">');
        for (var j = 0; j < boardSize; j++) {
            $('#row-' + i).append('<div class=\"box hide\" id=\"box-' + i + '-' + j + '\">');
        }
    }
}

//Draw board functions
function drawBoard(ctx) {

    var x = rootX, y = rootY;

    ctx.lineWidth = 2;
    ctx.beginPath();

    ctx.fillStyle = '#F2B06D';
    ctx.fillRect(rootX - 40, rootY - 40, 80 + boxSize * (boardSize - 1), 80 + boxSize * (boardSize - 1));

    for (var i = 0; i < boardSize; i++) {
        drawLine(ctx, x, y, 0, boxSize * (boardSize - 1));
        x += boxSize;
    }
    x = rootX, y = rootY;
    for (var i = 0; i < boardSize; i++) {
        drawLine(ctx, x, y, boxSize * (boardSize - 1), 0);
        y += boxSize;
    }

    drawLine(ctx, rootX - 40, rootY - 40, 0, 80 + boxSize * (boardSize - 1));
    drawLine(ctx, rootX + 40 + boxSize * (boardSize - 1), rootY - 40, 0, 80 + boxSize * (boardSize - 1));
    drawLine(ctx, rootX - 40, rootY - 40, 80 + boxSize * (boardSize - 1), 0);
    drawLine(ctx, rootX - 40, rootY + 40 + boxSize * (boardSize - 1), 80 + boxSize * (boardSize - 1), 0);

    ctx.fillStyle = '#000';
    drawPoint(ctx, 2, 2);
    drawPoint(ctx, 2, 6);
    drawPoint(ctx, 6, 2);
    drawPoint(ctx, 6, 6);
    drawPoint(ctx, 4, 4);
}

function drawLine(ctx, x, y, a, b) {
    ctx.moveTo(x, y);
    ctx.lineTo(x + a, y + b);
    ctx.stroke();
}

function drawPoint(ctx, x, y) {
    ctx.beginPath();
    ctx.arc(rootX + boxSize * x, rootY + boxSize * y, 5, 0, 2 * Math.PI);
    ctx.fill();
}
