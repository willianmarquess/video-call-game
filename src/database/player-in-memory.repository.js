import { randomUUID } from 'crypto';

const players = {}

export default class PlayerInMemoryRepository {

    #players = players;

    addPlayer(player) {
        const newId = randomUUID();
        this.#players[newId] = player;
        return { id: newId, ...this.#players[newId] };
    }

    updatePlayer(id, newData) {
        this.#players[id] = {
            ...this.#players[id],
            ...newData
        }
    }

    deletePlayer(id) {
        delete this.#players[id];
    }

    getPlayer(id) {
        return this.#players[id];
    }

    getPlayers() {
        return this.#players;
    }
}