export default class CallServer {

    #socketServer = null;
    #sockets = {};
    
    constructor(socketServer) {
        this.#socketServer = socketServer;
        this.#start();
    }
    
    #start() {
        this.#socketServer.on('connect', (socket) => {
            this.#sockets[socket.id] = socket;
            socket.on('start-in-call', () => this.#notifyAllAboutNewUser(socket));
            socket.on('disconnect', () => this.#onDisconnect(socket));
            socket.on('call', (data) => this.#onSendingCall(socket, data));
            socket.on('make-answer', (data) => this.#onMakeAnswer(socket, data));
            socket.on('ice-candidate', (data) => this.#onIceCandidate(socket, data));
        });
    }

    #notifyAllAboutNewUser(socket) {
        for (const id in this.#sockets) {
            if (id === socket.id) continue;
            this.#sockets[id].emit('new-user', socket.id);
        }
    }

    #onDisconnect(socket) {
        delete this.#sockets[socket.id];
    }

    #onSendingCall(socket, { offer, to }) {
        socket.to(to).emit('call-made', {
            offer,
            id: socket.id
        });
    }

    #onMakeAnswer(socket, { answer, to }) {
        socket.to(to).emit('answer-made', {
            answer,
            id: socket.id
        });
    }

    #onIceCandidate(socket, { candidate, to }) {
        socket.to(to).emit('add-ice-candidate', {
            candidate,
            id: socket.id
        });
    }

}