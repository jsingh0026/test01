import { Peer, PeerControls, PeerList } from '@andyet/simplewebrtc';
import { VolumeIcon, EyeIcon, CloseIcon } from './Icons';
import React, { useContext } from 'react';
import styled from 'styled-components';
import HiddenPeers from '../contexts/HiddenPeers';
import Placeholders from '../contexts/Placeholders';
import { TalkyButton } from '../styles/button';
import mq from '../styles/media-queries'

const MuteButton = styled.button`
  float: left;
`;

const Container = styled.ul({
  // [mq.MOBILE]:{
  //   position: 'absolute',
  //   bottom: 0,
  //   width: '100%',
  //   zIndex: 200,
  // },
  listStyle: 'none',
  '& li': {
    borderBottom: '1px solid #323132',
    [mq.MOBILE]:{
      display: 'flex',
      border: 'none',
      borderTop: '1px solid #6a6a6b',
      backgroundColor: 'transparent',
    },
  },
  'li:first-child':{
    [mq.MOBILE]:{
      border: 'none'
    }
  },
  'li:last-child':{
    borderBottomLeftRadius:'10px',
    borderBottomRightRadius:'10px',
    [mq.SMALL_DESKTOP]:{
      border: 'none'
    }
  }
});

const NameContainer = styled.div`
  padding: 8px 6px 0px;
  overflow: hidden;
  text-overflow: ellipsis;
  ${mq.MOBILE}{
    padding: 3px 6px 0px;
    width: 50%;
    padding-left: 15px;
  }
`;

const ButtonsContainer = styled.div`
  ${mq.MOBILE}{
    width: 45%;
    padding: 5px 0px;
  }
  text-align: center;
  padding: 5px 12px;
  button{
    background-color: transparent;
    border: none;
    outline: none;
  }
  svg{
    height: 16px
  }
`;

const ItemContainer = styled.li`
  color: #919192;
  background-color: #18181a;
`;

interface PeerListItemProps {
  peer: Peer;
}
// PeerListItem renders the displayName and mute controls for a peer.
const PeerListItem: React.SFC<PeerListItemProps> = ({ peer }) => {
  const { hiddenPeers, togglePeer } = useContext(HiddenPeers);
  const isHidden = hiddenPeers.includes(peer.id);
  return (
    <ItemContainer>
      <NameContainer>{peer.displayName || 'Anonymous'}</NameContainer>
      <ButtonsContainer>
        <PeerControls
          peer={peer}
          render={({ isMuted, mute, unmute }) => (
            <MuteButton onClick={() => (isMuted ? unmute() : mute())}>
              {isMuted ? (
                <VolumeIcon fill="white" />
              ) : (
                  <VolumeIcon fill="#4284f3" />
                )}
            </MuteButton>
          )}
        />
        <button onClick={() => togglePeer(peer.id)}>
          {isHidden ? (
            <EyeIcon fill="white" />
          ) : (
              <EyeIcon fill="#4284f3" />
            )}
        </button>
        <button style={{float:'right', width: '19px'}} disabled>
          <CloseIcon fill="transparent"/>
        </button>
      </ButtonsContainer>
    </ItemContainer>
  );
};

interface Props {
  roomAddress: string;
}

const Roster: React.SFC<Props> = ({ roomAddress }) => (
  <PeerList
    room={roomAddress}
    render={({ peers }) => {
      return peers.length > 0 ? (
        <Container>
          {peers.map(peer => (
            <PeerListItem key={peer.id} peer={peer} />
          ))}
        </Container>
      ) : (
          <Placeholders.Consumer>
            {({ emptyRosterPlaceholder }) => (
              <div
                ref={node => {
                  if (
                    node &&
                    emptyRosterPlaceholder &&
                    node.childElementCount === 0
                  ) {
                    const el = emptyRosterPlaceholder();
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

export default Roster;
