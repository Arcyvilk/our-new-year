import React from 'react';
import * as Fireworks from 'fireworks-canvas';
import StyledApp from './StyledApp';
import config from '../config.json';
import Users from '../components/Users';

class App extends React.Component {
  constructor() {
    super();

    this.state = {
      user: null,
      participants: [ ]
    }
    this.fireworks = null;
    this.HBinterval = 5000;
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
      explosionMinHeight: 0.6,  // percentage. min height at which rockets can explode
      explosionMaxHeight: 1,    // percentage. max height before a particle is exploded
      explosionChance: 0.1      // chance in each tick the rocket will explode
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
      case 'firework': return this.fire(message)
      case 'update': return this.setState({ participants: message.participants.map(participant => ({ user: participant, active: false })) })
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
  sendFireEvent = event => {
    const firework = {
      user: this.state.user,
      type: "firework"
    }
    this.sendStringified(firework);
  }
  fire = async message => {
    this.fireworks.fire();
    this.activateUser(message.user, true);
    await this.sleep(200);
    this.activateUser(message.user, false);
  }
  activateUser = (user, active) => {
    this.setState({
      participants: [
        ...this.state.participants.map(participant => {
          if (participant.user === user) 
            participant.active = active;
          return participant;
        })
      ]
    })
  }

  // OTHER
  sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
  login = () => {
    return this.state.user
      ? <StyledApp onClick={ this.sendFireEvent } >
          <Users>{ 
            this.state.participants.map(participant => <Users.Nick active={ participant.active }><span role='img' aria-label='emoji'>🎆</span>{ participant.user }</Users.Nick>)
            }
          </Users>
          <div id='fireworks' />
        </StyledApp>
      : <div> :( </div>
  }

  render() {
    return this.login()
  }
}

export default App;
