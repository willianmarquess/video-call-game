export default class CallServer {

    #socketServer = null;
    #sockets = {};
    
    constructor(socketServer) {
        this.#socketServer = socketServer;
        this.#start();
    }
    
    #start() {
        this.#socketServer.on('connect', (socket) => {
            console.log(`client connected: ${socket.id}`);
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
            console.log('notify user ' + id);
            this.#sockets[id].emit('new-user', socket.id);
        }
    }

    #onDisconnect(socket) {
        console.log('disconnecting: ' + socket.id);
        delete this.#sockets[socket.id];
    }

    #onSendingCall(socket, { offer, to }) {
        console.log('sending call to ' + to);
        socket.to(to).emit('call-made', {
            offer,
            id: socket.id
        });
    }

    #onMakeAnswer(socket, { answer, to }) {
        console.log('make answer to ' + to);
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