import {
  GridLayout,
  Peer,
  PeerList,
  RemoteMediaList,
  UserControls
} from '@andyet/simplewebrtc';
import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import HiddenPeers from '../contexts/HiddenPeers';
import Placeholders from '../contexts/Placeholders';
import isMobile from '../utils/isMobile';
import PeerGridItem from './PeerGridItem';
import mq from '../styles/media-queries'
import Roster from './Roster';
import LocalMediaControls from './LocalMediaControls';
import { UserContext } from '../contexts/userMobileView';

const StyledGridLayout = styled(GridLayout)({
  display: 'flex !important',
  justifyContent: 'center',
  alignItems: 'center',
  [mq.SMALL_DESKTOP]: {
    flex: 1,
    maxHeight: '100vh',
  },
  [mq.MOBILE]: {
    display: 'flex !important',
    paddingTop: '55px'
  },
  backgroundColor: 'transparent',
  'ul': {
    [mq.SMALL_DESKTOP]: {
      display: 'none'
    }
  },
  '& video': {
    width: '100%',
    [mq.MOBILE]: {
    }
  },
  '& > div': {
    position: 'relative',
    [mq.MOBILE]: {
      height: 'min-content'
    }
  }
}) as any; // TODO: Fix this!

const UserConainter = styled.div`
  display: flex;
  border-bottom: 1px solid #6a6a6b;
  .username{
    width: 50%;
    padding-left: 15px;
    display: flex;
    align-items: center;
  }
  div:nth-child(2) {
    width: 45%;
    div:first-child{
      background-color: transparent;
      padding: 5px 0px;
    }
  }
`;

const RosterContainer = styled.span`
  ${mq.SMALL_DESKTOP}{
    display: none
  }
`;

interface Props {
  roomAddress: string;
  activeSpeakerView: boolean;
}

const toggleUserView = () =>{
  const userViewKey = 'toggleUserView';
  localStorage.setItem(userViewKey, 'true');
  const [value, setValue] = useState(0);
  return () => setValue(value => ++value);
}

// const speakingPeers = peers.filter(p => p.speaking);

// let peersToRender = [];
// if (speakingPeers) {
//   peersToRender = [...speakingPeers, peers.filter(p => p.hasSpokenInLast(5))];
// } else {
//   peersToRender = peers.filter(p => p.hasSpokenInLast(15));
// }

// if (peersToRender.length === 0) {
//   peersToRender = peers;
// }

// PeerGrid is the main video display for Talky. It matches remoteMedia to
// peers and then renders a PeerGridItem for each peer in the room.
const PeerGrid: React.SFC<Props> = ({ roomAddress, activeSpeakerView }) => {
  const { hiddenPeers } = useContext(HiddenPeers);
  const userViewKey = 'toggleUserView';
  var userView = localStorage.getItem(userViewKey);
  const { view, setView } = useContext(UserContext);
  console.log(view);
  return (
    <PeerList
      speaking={activeSpeakerView ? activeSpeakerView : undefined}
      room={roomAddress}
      render={({ peers }) => {
        const visiblePeers = peers.filter(p => !hiddenPeers.includes(p.id));
        console.log(visiblePeers, activeSpeakerView, peers);
        return visiblePeers.length > 0 || peers.length > 0 || activeSpeakerView ? (
          <>
            <StyledGridLayout
              items={visiblePeers}
              renderCell={(peer: Peer) => (
                <RemoteMediaList
                  peer={peer.address}
                  render={({ media }) => (
                    <PeerGridItem media={media} peer={peer} />
                  )}
                />
              )}
            />
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
                view == true ?
                  <UserConainter>
                    <div className='username'>{user.displayName ? user.displayName : 'Anonymous'}</div>
                    <LocalMediaControls
                      isMuted={isMuted}
                      unmute={unmute}
                      mute={mute}
                      isPaused={isPaused}
                      resumeVideo={resumeVideo}
                      pauseVideo={pauseVideo}
                      isSpeaking={isSpeaking}
                      isSpeakingWhileMuted={isSpeakingWhileMuted}
                      toggleUserView={()=> setView(view)}
                    />
                  </UserConainter>
                  :''
                )}
            />
            <RosterContainer>
            <Roster roomAddress={roomAddress} />
            </RosterContainer>
          </>
        ) : 
        
        (
            <Placeholders.Consumer>
              {({ gridPlaceholder }) => (
                <div
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative'
                  }}
                  ref={node => {
                    if (node && gridPlaceholder && node.childElementCount === 0) {
                      const el = gridPlaceholder();
                      if (el) {
                        node.appendChild(el);
                      }
                    }
                  }}
                />
              )}
            </Placeholders.Consumer>
          );
      }}
    />
  );
};

export default PeerGrid;
