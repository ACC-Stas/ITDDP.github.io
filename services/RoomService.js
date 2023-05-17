import UserService from './UserService.js';

const RoomService = {

    saveRoomToDb: (roomId) => {
        let user = UserService.getUserFromLocalStorage();
        firebase.database().ref("rooms").child(roomId).set({
            firstUser: user.id,
            blackUser: user.id,
            FEN: "-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1, 0"
        });
    },

    saveConnectedUserToDb: async(roomId) => {
        let user = UserService.getUserFromLocalStorage();
        firebase.database().ref("rooms").child(roomId).get().then((snapshot) => {
            if (snapshot.exists()) {
                let fUser = snapshot.val().firstUser;
                let fen = snapshot.val().FEN;
                if (fUser !== user.id) {
                    firebase.database().ref("rooms").child(roomId).set({
                        firstUser: fUser,
                        secondUser: user.id,
                        blackUser: fUser,
                        FEN: fen
                    });
                } else {
                    console.log('user is already host');
                }
                window.location.hash = '/play/:id' + roomId;
            } else {
                alert("no such a room: " + roomId);
            }
        }).catch((error) => {
            console.error(error);
        })
    },

    generateRoom: () => {
        let min = 99999;
        let max = 999999;
        return Math.floor(Math.random() * (max - min)) + min;
    },

    deleteRoomFromDb: (roomId) => {
        firebase.database().ref("rooms").child(roomId).remove().catch((error) => {
            console.error(error);
        });
    },

    checkRoom: async(roomId) => {
        let user = UserService.getUserFromLocalStorage();
        let result = await firebase.database().ref("rooms").child(roomId).get().then((snapshot) => {
            if (snapshot.exists()) {
                return snapshot.val().firstUser == user.id || snapshot.val().secondUser == user.id;
            } else {
                return false;
            }
        }).catch((error) => {
            console.error(error);
            return false;
        })
        return result;
    },

    getPlayers: async(roomId) => {
        let user = UserService.getUserFromLocalStorage();
        let result = firebase.database().ref("rooms").child(roomId).get().then((snapshot) => {
            if (snapshot.exists()) {
                if (user.id == snapshot.val().firstUser) {
                    return {
                        me: snapshot.val().firstUser,
                        opponent: snapshot.val().secondUser
                    }
                } else if (user.id == snapshot.val().secondUser) {
                    return {
                        opponent: snapshot.val().firstUser,
                        me: snapshot.val().secondUser
                    }
                }

            }
        }).catch((error) => {
            console.error(error);
        });
        return result;
    },

    updateFen: (roomId, fen) => {
        firebase.database().ref("rooms").child(roomId).get().then((snapshot) => {
            if (snapshot.exists()) {
                console.log('SNAPSHOT');
                firebase.database().ref("rooms").child(roomId).set({
                    firstUser: snapshot.val().firstUser,
                    secondUser: snapshot.val().secondUser,
                    blackUser: snapshot.val().firstUser,
                    FEN: fen
                });
            }
        }).catch((error) => {
            console.error(error);
        });
    },

    getBlack: async(roomId) => {
        let result = await firebase.database().ref("rooms").child(roomId).get().then((snapshot) => {
            if (snapshot.exists()) {
                return snapshot.val().blackUser;
            }
        }).catch((error) => {
            console.error(error);
        });
        console.log("get BlackUser from db: " + result)
        return result;
    },

}

export default RoomService;