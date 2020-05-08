import React, { Component } from 'react';
import styled, { css } from 'styled-components';
import mq from '../styles/media-queries';
import { colorToString } from '../utils/colorify';
import RoomControls from './RoomControls';
import Roster from './Roster';
import SidebarLinks from './SidebarLinks';
import SidebarUserControls from './SidebarUserControls';

const Container = styled.div`
  position: relative;
  padding: 3px;
  ${mq.MOBILE} {
    position: absolute;
    z-index: 200;
    top: 0;
    right: 0;
    width: 185px;
  }
  ${mq.SMALL_DESKTOP} {
    width: 230px;
  }
`;

interface Props {
  roomAddress: string;
  activeSpeakerView: boolean;
  toggleActiveSpeakerView: () => void;
  pttMode: boolean;
  togglePttMode: (e: React.SyntheticEvent) => void;
  setPassword: (s: string) => void;
  passwordRequired?: boolean;
  roomId: string;
}

interface State {
  showPasswordModal: boolean;
}

// Sidebar contains all the UI elements that are rendered in the Sidebar
// inside a Room.
// TODO: Use Router to navigate to feedback page.
export default class Sidebar extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { showPasswordModal: false };
  }

  public render() {
    const {
      roomAddress,
      activeSpeakerView,
      toggleActiveSpeakerView,
      passwordRequired,
      pttMode,
      togglePttMode,
      setPassword,
      roomId
    } = this.props;

    return (
      <Container>
        <SidebarUserControls
          activeSpeakerView={activeSpeakerView}
          toggleActiveSpeakerView={toggleActiveSpeakerView}
          pttMode={pttMode}
          togglePttMode={togglePttMode}
        />
        <Roster roomAddress={roomAddress} />
        <SidebarLinks roomId={roomId} />
        <RoomControls
          shouldShowPasswordModal={this.state.showPasswordModal}
          passwordRequired={passwordRequired}
          showPasswordModal={this.showPasswordModal}
          hidePasswordModal={this.hidePasswordModal}
          setPassword={setPassword}
        />
      </Container>
    );
  }

  private showPasswordModal = () => {
    this.setState({ showPasswordModal: true });
  };

  private hidePasswordModal = () => {
    this.setState({ showPasswordModal: false });
  };
}
