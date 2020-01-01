import React from 'react';
import styled from 'styled-components';

const StyledNick = styled.li`
    opacity: 0.2;
`;

const StyledNickActive = styled.li`
    opacity: 0.5;
`;

export default class Nick extends React.Component {
    render() {
        return this.props.active
            ? <StyledNickActive>{ this.props.children }</StyledNickActive> 
            : <StyledNick>{ this.props.children }</StyledNick>
    }
}