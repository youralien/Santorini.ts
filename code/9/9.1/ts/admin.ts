var fs = require('fs')
const net = require('net')
import {RemoteProxyPlayer} from "./player";


export class Admin {
    tournament_type: string;
    num_players: number;
    ip_address: string;
    port: number;
    server;
    client;
    players;

    constructor (tournament_type: string, num_players: number) {
        this.tournament_type = tournament_type;
        this.num_players = num_players; 
        let buffer = fs.readFileSync(`${ __dirname }/../santorini.config`, 'utf8');
        let parsed = JSON.parse(buffer.toString());
        this.ip_address = parsed["IP"]
        this.port = parsed["port"]
        this.players = [];

        this.server = net.createServer(function(client) {
            console.log(this.ip_address);
            this.players.push(new RemoteProxyPlayer(client));
            console.log(this.players.length);
        }.bind(this));
        this.server.listen(8000, '');
    }
}
let admin = new Admin("hello", 3);
