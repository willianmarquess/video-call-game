import express from 'express';
import cors from 'cors';
import { Server } from 'socket.io';
import http from 'http';
import GameServer from './controllers/game-server.controller.js';
import PlayerInMemoryRepository from './database/player-in-memory.repository.js';
import CallServer from './controllers/call-server.controller.js';

function main() {
    const app = express();
    const server = new http.createServer(app);
    const playerRepository = new PlayerInMemoryRepository();

    const socketServer = new Server(server,{
        cors: {
            origin: '*'
        }
    });

    new GameServer(socketServer, playerRepository);
    new CallServer(socketServer);

    app.use(cors());
    app.use(express.json());

    app.use('/', express.static('public'));

    app.post('/login', (req, res) => {
        const { name } = req.body;
        if(!name) return res.status(400).end();
        const newPlayer = playerRepository.addPlayer({ name });
        return res.status(200).json(newPlayer);
    })

    server.listen(3333, () => {
        console.log('server running on http://localhost:3333');
    })
}

main();