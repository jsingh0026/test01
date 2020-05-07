// import MicIcon from 'material-icons-svg/components/baseline/Mic';
// import MicOffIcon from 'material-icons-svg/components/baseline/MicOff';
// import VideocamIcon from 'material-icons-svg/components/baseline/Videocam';
// import VideocamOffIcon from 'material-icons-svg/components/baseline/VideocamOff';
import React from 'react';
import styled, { css, keyframes } from 'styled-components';
import { TalkyButton } from '../styles/button';
import mq from '../styles/media-queries';
import ScreenshareControls from './ScreenshareControls';
import { MicroPhone, VideocamIcon, SettingsIcon } from './Icons';
import {
  LocalMediaList,
  Media,
  MediaControls,
  UserControls,
  Video
} from '@andyet/simplewebrtc';

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
  background-color: #18181a;
  text-align: center;
  padding: 8px;
  button{
    background-color: transparent;
    border: none;
    outline: none;
  }
  svg{
    height: 20px
  }
`;

const ScreenShareContainer = styled.div`
  background-color: #18181a;
  padding: 8px;
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
}

interface LocalScreenProps {
  screenshareMedia: Media;
}

const LocalScreenContainer = styled.div({
  position: 'relative'
});
const LocalScreenOverlay = styled.div({
  position: 'absolute',
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'black',
  opacity: 0,
  transition: 'opacity 200ms linear',
  color: 'white',
  zIndex: 100,
  '&:hover': {
    cursor: 'pointer',
    opacity: 0.8
  }
});


const LocalScreen: React.SFC<LocalScreenProps> = ({ screenshareMedia }) => (
  <MediaControls
    media={screenshareMedia}
    autoRemove={true}
    render={({ media, stopSharing }) => (
      <LocalScreenContainer>
        <LocalScreenOverlay onClick={stopSharing}>
          <span>Stop sharing</span>
        </LocalScreenOverlay>
        {media && <Video media={media!} />}
      </LocalScreenContainer>
    )}
  />
);

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
      <MicroPhone />
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
    <ScreenShareContainer>
    <ScreenshareControls />
          <LocalMediaList
            shared={true}
            render={({ media }) => {
              const videos = media.filter((v,i,a)=>a.findIndex(t=>(t.screenCapture === v.screenCapture))===i)
              console.log(videos);
              // const video = videos[0];
              // return(
              //   video.screenCapture ? (
              //     <LocalScreen screenshareMedia={video} />
              //   ) : (
              //     <Video key={video.id} media={video} />
              //   )
              // )
              if (videos.length > 0) {
                return (
                  <>
                    {videos.map(m =>
                      m.screenCapture &&
                      // ? (
                        <LocalScreen screenshareMedia={m} />
                      // ) : (
                        // <div style={{transform: 'scaleX(-1)'}}>
                        // <Video key={m.id} media={m} />
                        // </div>
                      // )
                    )}
                  </>
                );
              }

              return null;
            }}
          />
        </ScreenShareContainer>
  </Container>
);

export default LocalMediaControls;
