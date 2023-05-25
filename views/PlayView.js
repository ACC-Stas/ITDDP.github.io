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
                <img src="./img/board.png" class="board-img">
                
                <div class="board" id="board">
                    <div class="rowgo" id="row-0">
                        <div class="box hide" id="box-0-0"></div>
                        <div class="box hide" id="box-0-1"></div>
                        <div class="box hide" id="box-0-2"></div>
                        <div class="box hide" id="box-0-3"></div>
                        <div class="box hide" id="box-0-4"></div>
                        <div class="box hide" id="box-0-5"></div>
                        <div class="box hide" id="box-0-6"></div>
                        <div class="box hide" id="box-0-7"></div>
                        <div class="box hide" id="box-0-8"></div>
                    </div>
                    <div class="rowgo" id="row-1">
                        <div class="box hide" id="box-1-0"></div>
                        <div class="box hide" id="box-1-1"></div>
                        <div class="box hide" id="box-1-2"></div>
                        <div class="box hide" id="box-1-3"></div>
                        <div class="box hide" id="box-1-4"></div>
                        <div class="box hide" id="box-1-5"></div>
                        <div class="box hide" id="box-1-6"></div>
                        <div class="box hide" id="box-1-7"></div>
                        <div class="box hide" id="box-1-8"></div>
                    </div>
                    <div class="rowgo" id="row-2">
                        <div class="box hide" id="box-2-0"></div>
                        <div class="box hide" id="box-2-1"></div>
                        <div class="box hide" id="box-2-2"></div>
                        <div class="box hide" id="box-2-3"></div>
                        <div class="box hide" id="box-2-4"></div>
                        <div class="box hide" id="box-2-5"></div>
                        <div class="box hide" id="box-2-6"></div>
                        <div class="box hide" id="box-2-7"></div>
                        <div class="box hide" id="box-2-8"></div>
                    </div>
                    <div class="rowgo" id="row-3">
                        <div class="box hide" id="box-3-0"></div>
                        <div class="box hide" id="box-3-1"></div>
                        <div class="box hide" id="box-3-2"></div>
                        <div class="box hide" id="box-3-3"></div>
                        <div class="box hide" id="box-3-4"></div>
                        <div class="box hide" id="box-3-5"></div>
                        <div class="box hide" id="box-3-6"></div>
                        <div class="box hide" id="box-3-7"></div>
                        <div class="box hide" id="box-3-8"></div>
                    </div>
                    <div class="rowgo" id="row-4">
                        <div class="box hide" id="box-4-0"></div>
                        <div class="box hide" id="box-4-1"></div>
                        <div class="box hide" id="box-4-2"></div>
                        <div class="box hide" id="box-4-3"></div>
                        <div class="box hide" id="box-4-4"></div>
                        <div class="box hide" id="box-4-5"></div>
                        <div class="box hide" id="box-4-6"></div>
                        <div class="box hide" id="box-4-7"></div>
                        <div class="box hide" id="box-4-8"></div>
                    </div>
                    <div class="rowgo" id="row-5">
                        <div class="box hide" id="box-5-0"></div>
                        <div class="box hide" id="box-5-1"></div>
                        <div class="box hide" id="box-5-2"></div>
                        <div class="box hide" id="box-5-3"></div>
                        <div class="box hide" id="box-5-4"></div>
                        <div class="box hide" id="box-5-5"></div>
                        <div class="box hide" id="box-5-6"></div>
                        <div class="box hide" id="box-5-7"></div>
                        <div class="box hide" id="box-5-8"></div>
                    </div>
                    <div class="rowgo" id="row-6">
                        <div class="box hide" id="box-6-0"></div>
                        <div class="box hide" id="box-6-1"></div>
                        <div class="box hide" id="box-6-2"></div>
                        <div class="box hide" id="box-6-3"></div>
                        <div class="box hide" id="box-6-4"></div>
                        <div class="box hide" id="box-6-5"></div>
                        <div class="box hide" id="box-6-6"></div>
                        <div class="box hide" id="box-6-7"></div>
                        <div class="box hide" id="box-6-8"></div>
                    </div>
                    <div class="rowgo" id="row-7">
                        <div class="box hide" id="box-7-0"></div>
                        <div class="box hide" id="box-7-1"></div>
                        <div class="box hide" id="box-7-2"></div>
                        <div class="box hide" id="box-7-3"></div>
                        <div class="box hide" id="box-7-4"></div>
                        <div class="box hide" id="box-7-5"></div>
                        <div class="box hide" id="box-7-6"></div>
                        <div class="box hide" id="box-7-7"></div>
                        <div class="box hide" id="box-7-8"></div>
                    </div>
                    <div class="rowgo" id="row-8">
                        <div class="box hide" id="box-8-0"></div>
                        <div class="box hide" id="box-8-1"></div>
                        <div class="box hide" id="box-8-2"></div>
                        <div class="box hide" id="box-8-3"></div>
                        <div class="box hide" id="box-8-4"></div>
                        <div class="box hide" id="box-8-5"></div>
                        <div class="box hide" id="box-8-6"></div>
                        <div class="box hide" id="box-8-7"></div>
                        <div class="box hide" id="box-8-8"></div>
                    </div>
                </div>
                
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

                firebase.database().ref("rooms").child(roomId).on("value", (snapShot) => {
                    console.log('FIREBASE changed');
                    useFEN(snapShot.val().FEN);
                    updateGameBy(board);
                });

                const boxes = document.querySelectorAll('[id^=box]');
                for (i = 0; i < boxes.length; i++) {
                    boxes[i].addEventListener('click', function () {
                        if (this.classList.contains('hide')) {
                            var box = this.id.match('box-(\\d+)-(\\d+)');
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

                                this.classList.add(player === 0 ? 'black' : 'white');
                                this.classList.remove('hide');

                                player === 0 ? player++ : player--;

                                let fen_str = calcFEN();
                                RoomService.updateFen(roomId, fen_str);
                            }
                        }

                    });
                }
            }

            await window.onload();
        }());
    }
}
export default PlayView;