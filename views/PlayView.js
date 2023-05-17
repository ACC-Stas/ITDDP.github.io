import User from '../models/User.js';
import RoomService from './../services/RoomService.js';
import UserService from './../services/UserService.js';

const PlayView = {
    render: async () => {
        return `
        <section class="game-section">
            <div class="opponent-info row">
                <img class="avatar-small" id="opponent-avatar">
                <div class="play-username" id="opponent-username">(<span id="opponent-rating"></span>)</div>
            </div>
            <div class="game">
                <canvas></canvas>
                <div class="board"></div>
            </div>
            <div class="my-info row">
                <img class="avatar-small" id="my-avatar">
                <span class="play-username" id="my-username">(<span id="my-rating"></span>)</span>
                <button class="give-up-btn" id="give-up-btn">give up</button>
            </div>
        </section>`;
    },
    afterRender: async () => {
        (await async function () {
            const logout_link = document.getElementById('logout_link');
            const login_link = document.getElementById('login_link');
            const register_link = document.getElementById('register_link');
            logout_link.addEventListener('click', e => {
                firebase.auth().signOut();
                localStorage.setItem("user", null);
            });
            let currentUser = JSON.parse(localStorage.getItem("user"));
            console.log(currentUser);
            if (currentUser == null) {
                logout_link.classList.add('hidden');
                login_link.classList.remove('hidden');
                register_link.classList.remove('hidden');
            } else {
                logout_link.classList.remove('hidden');
                login_link.classList.add('hidden');
                register_link.classList.add('hidden');
            }
            let hash = location.hash;
            let index = hash.indexOf(':id') + 3;
            let roomId = hash.substring(index);
            let hasRules = await RoomService.checkRoom(roomId);
            if (!hasRules) {
                window.location.hash = '/create-room'
            }
            let opponentAvatar = document.getElementById('opponent-avatar');
            let opponentUsername = document.getElementById('opponent-username');
            let myAvatar = document.getElementById('my-avatar');
            let myUsername = document.getElementById('my-username');

            let players = await RoomService.getPlayers(roomId); // return players.opponent/me
            if (!players.opponent) {
                alert('your friend did not entered the room');
                location.hash = '/create-room';
            }
            let opponent = await UserService.getUserFromDb(players.opponent);
            let me = await UserService.getUserFromDb(players.me);
            UserService.getUserAvatar(opponent.avatarPath, players.opponent).then(imgUrl => {
                opponentAvatar.src = imgUrl;
            });
            opponentUsername.innerHTML = opponent.username + opponentUsername.innerHTML;
            document.getElementById('opponent-rating').innerHTML = opponent.rating;

            UserService.getUserAvatar(me.avatarPath, players.me).then(imgUrl => {
                myAvatar.src = imgUrl;
            });
            myUsername.innerHTML = me.username + myUsername.innerHTML;
            document.getElementById('my-rating').innerHTML = me.rating;

            async function giveUp() {
                alert("You lose :(");
                UserService.increaseRating(players.opponent);
                UserService.decreaseRating(players.me);
                RoomService.deleteRoomFromDb(roomId);
                location.hash = '/create-room';
            }

            document.getElementById('give-up-btn').addEventListener('click', async (e) => {
                giveUp();
            })

            let black_id = await RoomService.getBlack(roomId);
            let is_black_user = currentUser.id === black_id;

            window.onload = function () {

                var canvas = document.getElementsByTagName('canvas')[0];
                var ctx = canvas.getContext('2d');

                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;

                drawBoard(ctx);

                createGrid();

                paintBoard();

                firebase.database().ref("rooms").child(roomId).on("value", (snapShot) => {
                    console.log('FIREBASE changed');
                    useFEN(snapShot.val().FEN);
                    updateGameBy(board);
                    paintBoard();
                });

                $('.box').on('click', function () {
                    if ($(this).hasClass('hide')) {
                        var box = $(this).attr('id').split('-');
                        var x = parseInt(box[1]);
                        var y = parseInt(box[2]);

                        testBoard[x][y] = player;
                        clearBoard(testBoard);

                        var is_black_turn = player === 0;

                        if (invalidTestBoard() || invalidMove(x, y) || (is_black_user !== is_black_turn)) {
                            showInvalidMove(x, y);
                            copyBoard(testBoard, board);
                            resetCheckBoard();
                        } else { //Valid move

                            copyBoard(backupBoard, board);

                            copyBoard(board, testBoard);
                            updateGameBy(board);

                            $(this).addClass(player === 0 ? 'black' : 'white');
                            $(this).removeClass('hide');

                            player === 0 ? player++ : player--;

                            let fen_str = calcFEN();
                            RoomService.updateFen(roomId, fen_str);
                        }

                        paintBoard();
                    }

                });

                function paintBoard() {
                    var test = $('#test');
                    test.html("current board<br>");
                    for (var i = 0; i < 9; i++) {
                        for (var j = 0; j < 9; j++) {
                            if (board[i][j] === EMPTY)
                                test.append('*   ');
                            else
                                test.append(board[i][j] + '    ');
                        }
                        test.append('<br>');
                    }
                    test.append('backup board<br>');
                    for (var i = 0; i < 9; i++) {
                        for (var j = 0; j < 9; j++) {
                            if (backupBoard[i][j] === EMPTY)
                                test.append('*   ');
                            else
                                test.append(backupBoard[i][j] + '    ');
                        }
                        test.append('<br>');
                    }
                    test.append('test board<br>');
                    for (var i = 0; i < 9; i++) {
                        for (var j = 0; j < 9; j++) {
                            if (testBoard[i][j] === EMPTY)
                                test.append('*   ');
                            else
                                test.append(testBoard[i][j] + '    ');
                        }
                        test.append('<br>');
                    }
                }
            }

            await window.onload();
        }());
    }
}
export default PlayView;