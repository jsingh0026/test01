import { Media, Peer, PeerControls, Video } from '@andyet/simplewebrtc';
import VolumeOffIcon from 'material-icons-svg/components/baseline/VolumeOff';
import VolumeUpIcon from 'material-icons-svg/components/baseline/VolumeUp';
import React, { useContext } from 'react';
import styled from 'styled-components';
import HiddenPeers from '../contexts/HiddenPeers';
import { TalkyButton } from '../styles/button';
import AudioOnlyPeer from './AudioOnlyPeer';
import mq from '../styles/media-queries'

const MuteButton = styled(TalkyButton)({
  display: 'inline-block',
  justifySelf: 'flex-end',
  opacity: 0.3,
  backgroundColor: 'black',
  color: 'white',
  transition: 'opacity 200ms linear',
  marginBottom: '16px',
  marginLeft: '16px',
  ':hover': {
    backgroundColor: 'black',
    opacity: 0.7
  }
});

const DisplayName = styled.span({
  display: 'inline-block',
  color: '#919192',
  backgroundColor: '#323132',
  marginTop: '16px',
  marginLeft: '16px',
  fontSize: '16px',
  padding: '2px 7px 2px 9px',
  borderRadius: '10px',
  transition: 'opacity 200ms linear',
  '&:hover': {
    cursor: 'pointer',
    opacity: 0.7
  },
  [mq.MOBILE]:{
    display: 'none'
  }
});

const PictureInPictureContainer = styled.div({
  position: 'relative',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  '& video:first-of-type': {},
  '& video:last-of-type': {
    position: 'absolute',
    top: '16px',
    right: '16px',
    width: '100px'
  }
});

interface PeerGridItemOverlayProps {
  peer: Peer;
  // audioIsMuted: boolean;
}

const PeerGridItemOverlay: React.SFC<PeerGridItemOverlayProps> = ({
  peer,
  // audioIsMuted
}) => {
  const { togglePeer } = useContext(HiddenPeers);
  return (
    <Overlay>
      {/* <div> */}
        {/* <DisplayName onClick={() => togglePeer(peer.id)}> */}
        <DisplayName>
          {`${(peer.displayName)?peer.displayName:'Anonymous'}`}
        </DisplayName>
      {/* </div> */}
      {/* <RttContainer>{peer.rtt && <span>{peer.rtt}</span>}</RttContainer> */}
      {/* <MuteIndicator>
        {peer.muted || audioIsMuted ? (
          <VolumeOffIcon fill={peer.speaking ? 'red' : 'white'} />
        ) : null}
      </MuteIndicator> */}
      {/* <PeerControls
        peer={peer}
        render={({ isMuted, mute, unmute }) => (
          <div>
            <MuteButton onClick={() => (isMuted ? unmute() : mute())}>
              {isMuted ? (
                <>
                  <VolumeOffIcon fill="white" />
                  <span>Unmute</span>
                </>
              ) : (
                <>
                  <VolumeUpIcon fill="white" />
                  <span>Mute</span>
                </>
              )}
            </MuteButton>
          </div>
        )}
      /> */}
    </Overlay>
  );
};

interface PeerGridItemMediaProps {
  media: Media[];
  peer: Peer
}

// PeerGridItemMedia renders a different visualization based on what media is
// available from a peer. It will render video if the peer is sending video,
// otherwise it renders an audio-only display.
const PeerGridItemMedia: React.SFC<PeerGridItemMediaProps> = ({ media, peer }) => {
  const videoStreams = media.filter(
    m => m.kind === 'video' && !m.remoteDisabled
  );
  const audioStreams = media.filter(m => m.kind === 'audio');

  if (videoStreams.length > 0) {
    // Choose last media as it is most likely the screenshare.
    const webcamStreams = videoStreams.filter(s => !s.screenCapture);
    const screenCaptureStreams = videoStreams.filter(s => s.screenCapture);

    if (videoStreams.length === 1) {
      console.log("111111");
      return <>
      <PeerGridItemOverlay peer={peer}/>
      <Video media={videoStreams[0]} />
      </>
    }

    if (screenCaptureStreams.length === 0) {
      console.log("2222222");
      return <>
      <PeerGridItemOverlay peer={peer}/>
      <Video media={webcamStreams[0]} />
      </>
    }

    return (
      <PictureInPictureContainer>
        {/* Screenshare */}
        <Video media={screenCaptureStreams[0]} />
        {/* Camera */}
        <Video media={webcamStreams[0]} />
      </PictureInPictureContainer>
    );
  } else if (audioStreams.length > 0) {
    return <AudioOnlyPeer />;
  }
  return null;
  // return <div>No media</div>;
};

const Overlay = styled.div({
  position: 'absolute',
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  zIndex: 100,
  display: 'flex',
  flexDirection: 'column',
  width: 'max-content'
});

const RttContainer = styled.div({
  flex: 1,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'flex-end',
  '& span': {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    color: 'white',
    padding: '8px 16px',
    borderRadius: '4px',
    fontSize: '18px'
  }
});

const MuteIndicator = styled.span({
  textAlign: 'center',
  fontSize: '48px',
  opacity: 0.8
});

function allAudioIsUnmuted(media: Media[]): boolean {
  for (const m of media) {
    if (m.kind === 'audio' && m.remoteDisabled) {
      return false;
    }
  }
  return true;
}

interface PeerGridItemProps {
  peer: Peer;
  media: Media[];
}

// PeerGridItem renders various controls over a peer's media.
const PeerGridItem: React.SFC<PeerGridItemProps> = ({ peer, media }) => (
  <>
    {/* <PeerGridItemOverlay peer={peer} audioIsMuted={!allAudioIsUnmuted(media)} /> */}
    <PeerGridItemMedia peer={peer} media={media} />
  </>
);

export default PeerGridItem;
