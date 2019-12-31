import WebSocket from 'ws';
import http from 'http';

type TMessage = {
    user: string,
    type: string // "firework" // HB
}
class WS {
    private HB: {
        interval: number,
        timeout: number
    }
    private clients: any[ ];
    private ws:any;

    constructor(server:http.Server) {
        this.HB = {
            interval: 2000,
            timeout: 10000
        }
        this.clients = [];;
    }

    messageType = {
        firework: (message:TMessage) => this.clients.map(client => client.ws.send(JSON.stringify(message))),
        joined: (message:TMessage, client:any) => {
            this.clients.push({
                user: message.user,
                lastSeen: Date.now(),
                ws: client,
            });
            const participantsUpdate = {
                participants: this.clients.map(client => client.user),
                type: 'update'
            };
            this.clients.map(client => client.ws.send(JSON.stringify(participantsUpdate)));
        },
        HB: (message:TMessage) => {
            this.clients.map(client => {
                if (client.user === message.user)
                    client.lastSeen = Date.now();
            })
        }
    }

    sendInitialData = (client:WebSocket) => {
        const initialData = {
            participants: this.clients.map(client => client.user),
            type: 'update'
        };
        client.send(JSON.stringify(initialData))
    }

    filterInactiveClients = (client:any) => {
        if (Date.now() - client.lastSeen >= this.HB.timeout) {
            console.log(`${new Date()} - user left - ${client.user}`);
            const msgUpdate = {
                participants: this.clients.map(client => client.user),
                type: 'update'
            };
            this.clients.map(client => client.ws.send(JSON.stringify(msgUpdate)));
            return false;
        }
        return true;
    }

    monitorHBs = () => this.clients = this.clients.filter(client => this.filterInactiveClients(client));

    connectToWebsocket(ws:WebSocket.Server) {
        ws.on('connection', client => {
            this.sendInitialData(client);
            client.on('message', (msg: string) => {
                const message:TMessage = JSON.parse(msg);
                switch(message.type) {
                    case('firework'): return this.messageType.firework(message); 
                    case('HB'): return this.messageType.HB(message); 
                    default: return;
                }
            });

            client.on('close', (code, reason) => { });

            setInterval(this.monitorHBs, this.HB.interval);
        }) 
    }

    openWebsocket(roomID: string) {
        this.ws = new WebSocket.Server({ server: this.server, path: `/${roomID}` });
        this.connectToWebsocket(this.ws);            
    }
}

export default WS;