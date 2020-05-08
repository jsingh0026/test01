import { Peer, PeerControls, PeerList } from '@andyet/simplewebrtc';
import { VolumeIcon, EyeIcon, CloseIcon } from './Icons';
import React, { useContext } from 'react';
import styled from 'styled-components';
import HiddenPeers from '../contexts/HiddenPeers';
import Placeholders from '../contexts/Placeholders';
import { TalkyButton } from '../styles/button';

const MuteButton = styled.button`
  float: left;
`;

const Container = styled.ul({
  listStyle: 'none',
  '& li': {
    borderBottom: '1px solid #323132'
  }
});

const ButtonsContainer = styled.div`
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
      <div style={{padding:'0px 5px'}}>{peer.displayName || 'Anonymous'}</div>
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
        <button style={{float:'right'}}>
          <CloseIcon fill="white"/>
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
