import React from 'react';
import * as Fireworks from 'fireworks-canvas';
import StyledApp from './StyledApp';
import config from '../config.json';

class App extends React.Component {
  constructor() {
    super();

    this.state = {
      user: null
    }
    this.fireworks = null;
    this.HBinterval = 2000;
    this.url = `ws://${config.HOST ? config.HOST : 'localhost'}:${config.PORT}`;
    this.ws = null;
  }

  componentWillMount = () => {
    const user = prompt("Enter your nickname");
    
    if (!user)
      return;
    else
      this.setState({ user });
  }
  componentDidMount = () => this.init();

  init = () => {
    const container = document.getElementById('fireworks')
    const options = {
      maxRockets: 5,            // max # of rockets to spawn
      rocketSpawnInterval: 150, // millisends to check if new rockets should spawn
      numParticles: 100,        // number of particles to spawn when rocket explodes (+0-10)
      explosionMinHeight: 0.5,  // percentage. min height at which rockets can explode
      explosionMaxHeight: 0.9,  // percentage. max height before a particle is exploded
      explosionChance: 0.08     // chance in each tick the rocket will explode
    }
    
    if (!container)
      return;
    else {
      this.fireworks = new Fireworks(container, options);
      this.openWs();
    }
  }

  // WEBSOCKETS
  sendStringified = (message) => this.ws.send(JSON.stringify(message));
  openWs = () => {
    this.ws = new WebSocket(this.url);
    this.ws.onopen = () => {
      const data = {
        type: 'joined',
        user: this.state.user
      };
      this.sendStringified(data);
    }
    this.ws.onclose = () => console.log(`Websocket disconnected - ${this.url}`);
    this.ws.onmessage = event => {
      const message = JSON.parse(event.data);
      this.receiveMessage(message);
    }
    setInterval(this.sendHB, this.HBinterval);
    console.log(`Websocket connected - ${this.url}`)
  }
  receiveMessage = (message) => {
    switch(message.type) {
      case 'firework': return this.fireworks.fire()
      case 'update': return // [TODO]
      default: return
    }
  }
  sendHB = () => {
    const data = { 
        type: 'HB',
        user: this.state.user
    };
    this.sendStringified(data);
  }

  // FIREWORKS
  fire = event => {
    const firework = {
      user: this.state.user,
      type: "firework"
    }
    this.sendStringified(firework);
  }

  login = () => {
    return this.state.user
      ? <StyledApp onClick={ this.fire } >
          <div id='fireworks' />
        </StyledApp>
      : <div> :( </div>
  }

  render() {
    return this.login()
  }
}

export default App;
