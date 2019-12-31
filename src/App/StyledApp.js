import styled from 'styled-components';
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

export default StyledApp;