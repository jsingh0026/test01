import VideocamOffIcon from 'material-icons-svg/components/baseline/VideocamOff';
import React from 'react';
import styled from 'styled-components';
import mq from '../styles/media-queries'

const Container = styled('div')({
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  backgroundColor: 'transparent'
});

const IconContainer = styled('div')({
  position: 'absolute',
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  zIndex: 10,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontSize: '80px',
  '& svg': {
    fill: 'rgba(255, 255, 255, 0.5)'
  }
});

const TextContainer = styled.div`
  ${mq.MOBILE}{
  font-size: 16px;
  position: fixed;
  bottom: 70vh;
  right: 8%;
  left: 10%;
  }
  font-size:26px;
`;

const AudioOnlyPeer = () => (
  <Container>
    <IconContainer>
      <TextContainer>This user has not selected a camera yet!</TextContainer>
    </IconContainer>
  </Container>
);

export default AudioOnlyPeer;
