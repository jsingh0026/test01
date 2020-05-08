import {
  LocalMediaList,
  Media,
  MediaControls,
  UserControls,
  Video
} from '@andyet/simplewebrtc';
import React from 'react';
import styled from 'styled-components';
import DisplayNameInput from './DisplayNameInput';
import LocalMediaControls from './LocalMediaControls';
import Tooltip from './Tooltip';

const LocalVideo = styled.div({
  position: 'relative',
  '& input': {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    zIndex: 100,
    width: '100%',
    boxSizing: 'border-box',
    border: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    color: 'white',
    fontSize: '14px',
    padding: '8px'
  },
  '& video': {
    display: 'block',
    objectFit: 'cover',
    width: '100%',
    height: '100%',
  }
});

const RoomModeToggles = styled.div({
  marginBottom: '10px',
  '& input': {
    marginRight: '5px'
  },
  '& label': {
    fontWeight: 'bold',
    fontSize: '12px'
  }
});

const EmptyVideo = styled.div({
  width: '100%',
  height: '133px',
  backgroundColor: '#262a2c',
  marginBottom: '10px'
});

const ToggleContainer = styled.label({
  display: 'flex',
  alignItems: 'center',
  marginBottom: '5px'
});

interface Props {
  activeSpeakerView: boolean;
  toggleActiveSpeakerView: () => void;
  pttMode: boolean;
  togglePttMode: (e: React.SyntheticEvent<Element>) => void;
}

interface LocalScreenProps {
  screenshareMedia: Media;
}

const LocalScreenContainer = styled.div({
  position: 'relative'
});

const Container = styled.div`
  background-color: #323132;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px
  input{
    border: none;
    background-color: transparent;
    outline: none;
    caret-color: #4284f3;
    padding: 7px;
  }
`;

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

const SidebarUserControls: React.SFC<Props> = ({
  activeSpeakerView,
  toggleActiveSpeakerView,
  pttMode,
  togglePttMode
}) => (
  <UserControls
    render={({
      isMuted,
      mute,
      unmute,
      isPaused,
      isSpeaking,
      isSpeakingWhileMuted,
      pauseVideo,
      resumeVideo,
      user,
      setDisplayName
    }) => (
      <Container>
        <DisplayNameInput
            displayName={user.displayName}
            setDisplayName={setDisplayName}
          />
        <LocalVideo>
          <LocalMediaList
            shared={true}
            render={({ media }) => {
              const videos = media.filter((v,i,a)=>a.findIndex(t=>(t.screenCapture === v.screenCapture))===i)
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
                      !m.screenCapture &&
                      // ? (
                        // <LocalScreen screenshareMedia={m} />
                      // ) : (
                        <div style={{transform: 'scaleX(-1)',border: '2px solid #323132'}}>
                        <Video key={m.id} media={m} />
                        </div>
                      // )
                    )}
                  </>
                );
              }

              return <EmptyVideo />;
            }}
          />
        </LocalVideo>
        <LocalMediaControls
          isMuted={isMuted}
          unmute={unmute}
          mute={mute}
          isPaused={isPaused}
          resumeVideo={resumeVideo}
          pauseVideo={pauseVideo}
          isSpeaking={isSpeaking}
          isSpeakingWhileMuted={isSpeakingWhileMuted}
        />
        {/* <RoomModeToggles> */}
          {/*
              Disabled until SDK changes fixed to handle case where no one is speaking.

              <div>
                <ToggleContainer>
                  <input
                    type="checkbox"
                    checked={activeSpeakerView}
                    onChange={toggleActiveSpeakerView}
                  />
                  Active Speaker View
                  <Tooltip text="Only show the active speaker in the podium" />
                </ToggleContainer>
              </div>
            */}
          {/* <div>
            <ToggleContainer>
              <input
                type="checkbox"
                checked={pttMode}
                onChange={togglePttMode}
              />
              Walkie Talkie Mode
              <Tooltip text="Use spacebar to toggle your microphone on/off" />
            </ToggleContainer>
          </div> */}
        {/* </RoomModeToggles> */}
      </Container>
    )}
  />
);

export default SidebarUserControls;
