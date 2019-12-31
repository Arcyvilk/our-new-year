import React from 'react';
import styled from 'styled-components';

const StyledUsers = styled.ul`
    position: absolute;
    width: auto;
    height: auto;
    display: flex;
    flex-direction: column;
    margin: 0;
    padding: 20px;
    font-family: Georgia;
    list-style-type: none;
    background-color: rgba(0,0,0,0.3);
    box-sizing: border-box;
    color: #fdc00033;

    h1 {
        margin: 0;
        font-size: 1.3em;
        font-family: verdana;
        font-weight: normal;
        text-transform: uppercase;
        letter-spacing: 0.2em;
    }
`;

class Users extends React.Component {
    render() {
        return <StyledUsers>
            <h1>Online</h1>
            { this.props.children }
        </StyledUsers>
    }
}

export default Users;