// import MicIcon from 'material-icons-svg/components/baseline/Mic';
// import MicOffIcon from 'material-icons-svg/components/baseline/MicOff';
// import VideocamIcon from 'material-icons-svg/components/baseline/Videocam';
// import VideocamOffIcon from 'material-icons-svg/components/baseline/VideocamOff';
import React, { useState } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { TalkyButton } from '../styles/button';
import mq from '../styles/media-queries';
import ScreenshareControls from './ScreenshareControls';
import { MicroPhone, VideocamIcon, SettingsIcon, ArrowUp, ArrowDown } from './Icons';
import DeviceSelector from './DeviceSelector';
import { Error, Info } from './Alerts';
import DeviceDropdown from './DeviceDropdown';
import InputChecker from './InputChecker';
import { max, min } from 'lodash-es';

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

const SettingsButton = styled.button<DisplayProps>`
  float: right;
  fill: ${props => (!props.isOpen ? '#4284f3':'white')};
  ${mq.MOBILE}{
    display: none;
  }
`;

const ToggleButton = styled.button`
  float: right;
  ${mq.SMALL_DESKTOP}{
    display: none;
  }
`;

const ButtonsContainer = styled.div`
  background-color: #18181a;
  text-align: center;
  padding: 7px 12px;
  button{
    background-color: transparent;
    border: none;
    outline: none;
  }
  svg{
    height: 16px
  }
`;

const ScreenShareContainer = styled.div`
  background-color: #18181a;
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
  toggleUserView: () => void;
}

const PermissionButton = styled(TalkyButton)({
  marginBottom: '5px',
  width: '100%',
});

const DropdownContainer = styled.div`
  margin-bottom: 10px
  svg{
    width: 12px !important;
    margin-top: -19px;
    margin-right: 3px !important;
  }
`;

interface DisplayProps{
  isOpen: Boolean
}

const ControlsContainer = styled.div<DisplayProps>`
  display: ${props => !props.isOpen ? '':'none'};
  margin-bottom: 5px;
  padding: 5px;
  color: #919192;
  label{
    vertical-align: middle;
  }
  select{
    width: 100%;
    min-width: 10px
    border: 1px solid #919192;
    color: white;
    padding: 5px;
    margin-top: 5px;
    background-color: transparent;
    font-size: 12px;
    border-radius: 10px;
    outline: 0;
    padding-right: 22px;
  }
  svg{
    width: 14px;
    fill: #919192;
    vertical-align: middle;
    margin-right: 6px;
  }
  .videoCamIcon {
    svg {
      width: 20px
    }
  }
  button{
    span{
      font-size: 13px;
    }
  }
`;

// LocalMediaControls displays buttons to toggle the mute/pause state of the
// user's audio/video.
const LocalMediaControls: React.SFC<LocalMediaControlsProps> = ({
  isMuted,
  unmute,
  mute,
  isPaused,
  isSpeakingWhileMuted,
  resumeVideo,
  pauseVideo,
  toggleUserView
}) => {
  const [open, setDisplay] = useState(true);
  const userViewKey = 'toggleUserView';
  var userView = localStorage.getItem(userViewKey);
  return (
    <Container>
      <ButtonsContainer>
        <MuteButton
          isOff={isMuted}
          isFlashing={isSpeakingWhileMuted}
          onClick={() => (isMuted ? unmute() : mute())}
        >
          <MicroPhone />
        </MuteButton>
        <PauseButton
          isOff={isPaused}
          onClick={() => (isPaused ? resumeVideo() : pauseVideo())}
        >
          <VideocamIcon />
        </PauseButton>
        <SettingsButton isOpen={open} onClick={() => setDisplay(!open)}>
          <SettingsIcon />
        </SettingsButton>
        <ToggleButton onClick={toggleUserView}>
          {userView == 'true' ? <ArrowUp fill='white'/> : <ArrowDown fill='white'/>}
        </ToggleButton>
      </ButtonsContainer>
      <ControlsContainer isOpen={open}>
        <div>
          <DeviceSelector
            kind="video"
            render={({
              hasDevice,
              permissionDenied,
              requestingCapture,
              requestPermissions,
              devices,
              currentMedia,
              selectMedia,
            }) => {
              if (true) {
                // console.log(
                //   hasDevice,
                //   permissionDenied,
                //   requestingCapture,
                //   requestPermissions,
                //   devices,
                //   currentMedia,
                //   selectMedia,
                //   'requestPermissions'
                // );
              }
              if (hasDevice === false) {
                return <Error>No cameras detected.</Error>;
              }

              if (permissionDenied === true) {
                return <Error>Camera permissions denied.</Error>;
              }

              if (requestingCapture === true) {
                return <Info>Requesting cameras...</Info>;
              }

              if (requestPermissions) {
                return (
                  <PermissionButton onClick={requestPermissions}>
                    <VideocamIcon />
                    <span>Allow camera access</span>
                  </PermissionButton>
                );
              }

              return (
                <label className="videoCamIcon">
                  <VideocamIcon />
                  <span>My Camera</span>
                  <DropdownContainer>
                    <DeviceDropdown
                      currentMedia={currentMedia!}
                      devices={devices!}
                      selectMedia={selectMedia!}
                    />
                  </DropdownContainer>
                </label>
              );
            }}
          />
        </div>
        <div>
          <DeviceSelector
            kind="audio"
            render={({
              hasDevice,
              permissionDenied,
              requestingCapture,
              requestPermissions,
              devices,
              currentMedia,
              selectMedia,
            }) => {
              if (hasDevice === false) {
                return <Error>No microphones detected.</Error>;
              }

              if (permissionDenied === true) {
                return <Error>Microphone permissions denied.</Error>;
              }

              if (requestingCapture === true) {
                return <Info>Requesting microphones...</Info>;
              }

              if (requestPermissions) {
                return (
                  <PermissionButton onClick={requestPermissions}>
                    <MicroPhone />
                    <span>Allow microphone access</span>
                  </PermissionButton>
                );
              }

              return (
                <>
                  <label>
                    <MicroPhone />
                    <span>My Microphone</span>
                    <DropdownContainer>
                      <DeviceDropdown
                        currentMedia={currentMedia!}
                        devices={devices!}
                        selectMedia={selectMedia!}
                      />
                    </DropdownContainer>
                  </label>
                  <InputChecker
                    media={currentMedia!}
                    threshold={7000}
                    render={({ detected, lost }) => {
                      if (detected && lost) {
                        return <Error>Media lost.</Error>;
                      }

                      if (!detected) {
                        return (
                          <Info>No input detected from your microphone.</Info>
                        );
                      }

                      return null;
                    }}
                  />
                </>
              );
            }}
          />
        </div>
      </ControlsContainer>
    </Container>
  );
}
export default LocalMediaControls;
