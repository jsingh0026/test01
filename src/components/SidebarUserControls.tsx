import {
  LocalMediaList,
  Media,
  MediaControls,
  UserControls,
  Video
} from '@andyet/simplewebrtc';
import React, { useState, useContext } from 'react';
import styled from 'styled-components';
import DisplayNameInput from './DisplayNameInput';
import LocalMediaControls from './LocalMediaControls';
import Tooltip from './Tooltip';
import { ArrowDown } from './Icons'
import mq from '../styles/media-queries';
import {UserContext} from '../contexts/userMobileView';

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
  height: '169px',
  backgroundColor: '#262a2c',
  alignItems: 'center',
  display: 'flex',
  justifyContent: 'center',
  'p':{
    margin: '0px'
  }
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
  toggleSidebar: () => void;
}

interface LocalScreenProps {
  screenshareMedia: Media;
}

const LocalScreenContainer = styled.div({
  position: 'relative'
});

const Container = styled.div`
  background-color: #323132;
  border-radius: 10px;
  input{
    height: 40px;
    border: none;
    background-color: transparent;
    outline: none;
    caret-color: #4284f3;
    width: 79%;
    padding: 7px;
    ${mq.MOBILE}{
      position: absolute;
      z-index: 1;
      background-color: #323132;
      opacity: 0.50;
      width: 100%;
    }
  }
  ${mq.MOBILE}{
    background-color: transparent;
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

const Toggle = styled.button`
background-color: transparent;
border: none;
outline: none;
svg {
  width: 43px;
  height: 12px;
  vertical-align: middle;
  padding-left: 7px;
}
${mq.MOBILE}{
  display: none;
}
`;

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

const toggleUserView = () => {
  const userViewKey = 'toggleUserView';
  localStorage.setItem(userViewKey, 'false');
  const [value, setValue] = useState(0);
  return () => setValue(value => ++value);
}

const SidebarUserControls: React.SFC<Props> = ({
  activeSpeakerView,
  toggleActiveSpeakerView,
  pttMode,
  togglePttMode,
  toggleSidebar
}) => {
  const userViewKey = 'toggleUserView';
  var userView = localStorage.getItem(userViewKey);
  const { view, setView } = useContext(UserContext);
  return( view == false ? 
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
            <Toggle onClick={toggleSidebar}>
              <ArrowDown fill='white' />
            </Toggle>
            <LocalVideo>
              <LocalMediaList
                shared={true}
                render={({ media }) => {
                  // const videos = media.filter((v, i, a) => a.findIndex(t => (t.screenCapture === v.screenCapture)) === i)
                  const videos = media.filter(m => m.kind === 'video');
                  
                  const video = videos[0];
                  // const video = videos[0];
                  // return(
                  //   video.screenCapture ? (
                  //     <LocalScreen screenshareMedia={video} />
                  //   ) : (
                  //     <Video key={video.id} media={video} />
                  //   )
                  // )
                  if (video && !video.localDisabled) {
                    return (
                      <>
                      {!video.screenCapture && <div style={{ border: '2px solid #323132' }}>
                            <Video key={video.id} media={video} />
                          </div>}
                        {/* {videos.map(m => {
                          !m.screenCapture &&
                          // ? (
                          // <LocalScreen screenshareMedia={m} />
                          // ) : (
                          <div style={{ transform: 'scaleX(-1)', border: '2px solid #323132' }}>
                            <Video key={m.id} media={m} />
                          </div>}
                          // )
                        )} */}
                      </>
                    );
                  }

                  return <EmptyVideo><p>No Camera Selected!</p></EmptyVideo>;
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
              toggleUserView={()=>setView(view)}
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
  :<></>)
}

export default SidebarUserControls;
