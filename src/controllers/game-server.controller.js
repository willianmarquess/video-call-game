export default class GameServer {

    #socketServer = null;
    #playerRepository = null;
    #sockets = new Map();

    constructor(socketServer, playerRepository) {
        this.#socketServer = socketServer;
        this.#playerRepository = playerRepository;
        this.#start();
    }

    #start() {
        this.#socketServer.on('connect', (socket) => {
            socket.on('player-start', (data) => this.#onPlayerStart(socket, data));
            socket.on('player-movement', (data) => this.#onPlayerMovement(socket, data));
            socket.on('disconnect', () => this.#onPlayerDisconnect(socket));
        });
    }

    #onPlayerStart(socket, data) {
        this.#sockets.set(socket.id, data.id);
        socket.emit('current-players', this.#playerRepository.getPlayers());
        this.#playerRepository.updatePlayer(data.id, data);
        socket.broadcast.emit('new-player', this.#playerRepository.getPlayer(data.id));
    }

    #onPlayerMovement(socket, data) {
        console.log('player updated');
        this.#playerRepository.updatePlayer(data.id, data);
        socket.broadcast.emit('player-moved', this.#playerRepository.getPlayer(data.id));
    }

    #onPlayerDisconnect(socket) {
        const playerId = this.#sockets.get(socket.id);
        this.#sockets.delete(playerId);
        this.#playerRepository.deletePlayer(playerId);
        this.#socketServer.emit('player-disconnected', playerId);
    }
}