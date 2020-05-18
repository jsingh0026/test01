import React, { Component } from 'react';
import styled, { css } from 'styled-components';
import mq from '../styles/media-queries';
import { colorToString } from '../utils/colorify';
import RoomControls from './RoomControls';
import Roster from './Roster';
import SidebarLinks from './SidebarLinks';
import SidebarUserControls from './SidebarUserControls';
import ScreenshareControls from './ScreenshareControls';
import {
  LocalMediaList,
  Media,
  MediaControls,
  UserControls,
  Video
} from '@andyet/simplewebrtc';

const Container = styled.div`
  position: relative;
  padding: 3px;
  ${mq.MOBILE} {
    position: absolute;
    z-index: 200;
    top: 8%;
    right: 0;
    width: 160px;
    padding: 0px;
    ul{
      display: none;
    }
  }
  ${mq.SMALL_DESKTOP} {
    width: 230px;
  }
`;

const ScreenShareContainer = styled.div`
  // background-color: #18181a;
`;


interface LocalScreenProps {
  screenshareMedia: Media;
}

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


const LocalScreenContainer = styled.div({
  position: 'relative',
  backgroundColor: '#000000',
  paddingBottom: '10px',
  'video': {
    border: '2px solid #323132',
  }
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


interface Props {
  roomAddress: string;
  activeSpeakerView: boolean;
  toggleActiveSpeakerView: () => void;
  pttMode: boolean;
  togglePttMode: (e: React.SyntheticEvent) => void;
  setPassword: (s: string) => void;
  passwordRequired?: boolean;
  roomId: string;
  toggleSidebar:() => void;
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
      roomId,
      toggleSidebar
    } = this.props;

    return (
      <Container>
        <SidebarUserControls
          activeSpeakerView={activeSpeakerView}
          toggleActiveSpeakerView={toggleActiveSpeakerView}
          pttMode={pttMode}
          togglePttMode={togglePttMode}
          toggleSidebar={toggleSidebar}
        />
      <ScreenShareContainer>
        <ScreenshareControls roomAddress={roomAddress} />
        <LocalMediaList
          shared={true}
          render={({ media }) => {
            const videos = media.filter((v, i, a) => a.findIndex(t => (t.screenCapture === v.screenCapture)) === i)
            console.log(videos)
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
