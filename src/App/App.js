import React from 'react';
import styled from 'styled-components';
// import fireworks from 'fireworks';
import * as Fireworks from 'fireworks-canvas';

import background from '../shared/images/city.jpg';

const StyledApp = styled.div`
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
  background: black url(${background}) no-repeat fixed center;
  background-size: cover;
  overflow: auto;

  #fireworks {
    width: 100%;
    height: 100%;
    box-sizing: border-box;

    canvas {
      width: 100%;
      height: 100%;
    }
  }
`;

class App extends React.Component {
  constructor() {
    super();

    this.fireworks = null;

    this.fire = this.fire.bind(this);
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
    this.fireworks = new Fireworks(container, options);
  }

  fire = event => {
    this.setState({
      x: event.clientX,
      y: event.clientY
    });
    
    this.fireworks.fire();
  }

  render() {
    return <StyledApp onClick={ this.fire } >
      <div id='fireworks' />
    </StyledApp>
  }
}

export default App;
