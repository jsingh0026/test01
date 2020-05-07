// import MicIcon from 'material-icons-svg/components/baseline/Mic';
// import MicOffIcon from 'material-icons-svg/components/baseline/MicOff';
// import VideocamIcon from 'material-icons-svg/components/baseline/Videocam';
// import VideocamOffIcon from 'material-icons-svg/components/baseline/VideocamOff';
import React from 'react';
import styled, { css, keyframes } from 'styled-components';
import { TalkyButton } from '../styles/button';
import mq from '../styles/media-queries';
import ScreenshareControls from './ScreenshareControls';
import MicIcon from '../icons/microphone.svg';
import VideocamIcon from '../icons/video 2.svg';
import SettingsIcon from '../icons/cog.svg';

interface MutePauseButtonProps {
  isFlashing?: boolean;
  isOff: boolean;
}

const pulseKeyFrames = keyframes`
  0% {
    opacity: 1;
  }
  50% {
    opacity: .25;
  }
  100% {
    opacity: 1;
  }
`;

const MuteButton = styled.button<MutePauseButtonProps>`
  float: left;
  svg {
    fill: ${props => (props.isOff ? 'white' : '#4284f3')};
  }
  }
`;

const SettingsButton = styled.button`
  float: right;
  fill: white;
`;

const ButtonsContainer = styled.div`
padding: 0px 8px;
  text-align: center;
  button{
    background-color: transparent;
    border: none;
    outline: none;
  }
  svg{
    height: 20px
  }
`;

const PauseButton = styled.button(({ isOff }: MutePauseButtonProps) => ({
  '& svg': {
    fill: isOff ? 'white' : '#4284f3'
  }
}));

// const MuteButton = styled.button(({ isOff }: MutePauseButtonProps) => ({
//   '& svg': {
//     fill: isOff ? 'white' : '#4284f3'
//   }
// }));

const Container = styled.div({
  // display: 'flex',
  // marginBottom: '10px',

  [mq.MOBILE]: {
    '& button': {
      flex: 1,
      '&:first-of-type': {
        marginRight: '10px'
      }
    }
  },
  [mq.SMALL_DESKTOP]: {
    // justifyContent: 'space-between'
  }
});

interface LocalMediaControlsProps {
  isMuted: boolean;
  unmute: () => void;
  mute: () => void;
  isPaused: boolean;
  isSpeaking: boolean;
  isSpeakingWhileMuted: boolean;
  resumeVideo: () => void;
  pauseVideo: () => void;
}

// LocalMediaControls displays buttons to toggle the mute/pause state of the
// user's audio/video.
const LocalMediaControls: React.SFC<LocalMediaControlsProps> = ({
  isMuted,
  unmute,
  mute,
  isPaused,
  isSpeakingWhileMuted,
  resumeVideo,
  pauseVideo
}) => (
  <Container>
    <ButtonsContainer>
    <MuteButton
      isOff={isMuted}
      isFlashing={isSpeakingWhileMuted}
      onClick={() => (isMuted ? unmute() : mute())}
    >
      <MicIcon />
    </MuteButton>
    <PauseButton
      isOff={isPaused}
      onClick={() => (isPaused ? resumeVideo() : pauseVideo())}
    >
      <VideocamIcon />
    </PauseButton>
    <SettingsButton>
      <SettingsIcon />
    </SettingsButton>
    </ButtonsContainer>
    <ScreenshareControls />
  </Container>
);

export default LocalMediaControls;
