import {
  Actions,
  Connected,
  Connecting,
  Disconnected,
  LocalMediaList,
  Provider,
  RemoteAudioPlayer,
  Room
} from '@andyet/simplewebrtc';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import ChatContainer from '../components/ChatContainer';
import ChatToggle from '../components/ChatToggle';
import Haircheck from '../components/Haircheck';
import PasswordEntry from '../components/PasswordEntry';
import PeerGrid from '../components/PeerGrid';
import Sidebar from '../components/Sidebar';
import SimpleWebRTCBanner from '../components/SimpleWebRTCBanner';
import SoundPlayer from '../components/SoundPlayer';
import HiddenPeers from '../contexts/HiddenPeers';
import mq from '../styles/media-queries';
import SidebarToggle from '../components/SidebarToggle';
import { DeviceSet } from '../contexts/DeviceSet';

const PasswordEntryContainer = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100vw',
  height: '100vh'
});

const RootContainer = styled.div({
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh'
});

const Container = styled.div({
  flex: 1,
  display: 'flex',
  position: 'relative',
  flexDirection: 'column',
  [mq.SMALL_DESKTOP]: {
    flexDirection: 'row'
  }
});

const LoadingState = styled.div({
  width: '100vw',
  height: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
});

const Timer = styled.div`
  ${mq.SMALL_DESKTOP}{
    display: none;
  }
  font-size: 20px;
  text-align: center;
  color: #919192;
`;

interface Props {
  configUrl: string;
  userData?: string;
  name: string;
  mute?: () => void;
  unmute?: () => void;
}

interface State {
  activeSpeakerView: boolean;
  pttMode: boolean;
  sendRtt: boolean;
  password?: string;
  chatOpen: boolean;
  sidebarOpen: boolean;
  hiddenPeers: string[];
  timer:{mins:number, secs:number},
  test: boolean,
  setting:{ setting:boolean, deviceSet: any}
}

class Index extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      activeSpeakerView: false,
      password: undefined,
      pttMode: false,
      sendRtt: false,
      chatOpen: false,
      sidebarOpen: true,
      hiddenPeers: [],
      timer: {mins:0, secs:0},
      test: true,
      setting:{setting: true, deviceSet: this.deviceSet}
    };
  }
  deviceSet = setting =>{
    this.setState({test: setting});
  }

  updateDimensions() {
    if(window.innerWidth > 749) {
      this.setState({sidebarOpen:true});
    }
  }

  componentDidMount() {
    this.updateDimensions();
    window.addEventListener("resize", this.updateDimensions.bind(this));
    setInterval(()=>{
      if(this.state.timer.secs === 60){
        this.setState(prevState =>({
          timer:{...this.state.timer, mins: prevState.timer.mins+1, secs: 0}
        }))
      }
      else{
      this.setState(prevState =>({
        timer:{...this.state.timer, secs: prevState.timer.secs+1}
      }))
    }
    localStorage.setItem("timer", JSON.stringify(this.state.timer.mins+':'+(this.state.timer.secs < 10 ? `0${ this.state.timer.secs }` : this.state.timer.secs)));
    }, 1000)
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions.bind(this));
  }
  public render() {
    var check = false;
    return (
      <Provider configUrl={this.props.configUrl} userData={this.props.userData}>
        <DeviceSet.Provider value={this.state.setting}>
        <LocalMediaList
          render={({ media }) => (
            <>
              {media.filter(m => m.shared).length === 0 || !this.state.test? (
                <Haircheck />
              ) : (
                <>
                  <RemoteAudioPlayer />
                  <Connecting configUrl="">
                    <LoadingState>
                      <h1>Connecting...</h1>
                    </LoadingState>
                  </Connecting>

                  <Disconnected configUrl="">
                    <LoadingState>
                      <h1 style={{padding:'5%', textAlign:'center'}}>Lost connection. Attempting to rejoin…</h1>
                    </LoadingState>
                  </Disconnected>

                  <Connected configUrl="">
                    <Room password={this.state.password} name={this.props.name}>
                      {({ room }) => {
                        if (!room.joined) {
                          if(room.roomState=="joining" && room.providedPassword){
                            check = true;
                          }
                          if (room.roomState == "password-required") {
                            return (
                              <PasswordEntryContainer>
                                <PasswordEntry
                                  setting={false}
                                  passwordIsIncorrect={check}
                                  setPassword={this.setPassword}
                                  onCancel={() => location.reload()}
                                />
                              </PasswordEntryContainer>
                            );
                          }

                          return (
                            <LoadingState>
                              <h1 style={{padding:'5%', textAlign:'center'}}>Your eVisit will begin soon!</h1>
                            </LoadingState>
                          );
                        }

                        return (
                          <HiddenPeers.Provider
                            value={{
                              hiddenPeers: this.state.hiddenPeers,
                              togglePeer: this.togglePeer
                            }}
                          >
                            <RootContainer>
                              <SimpleWebRTCBanner />
                              <Container>
                                <SoundPlayer roomAddress={room.address!} />
                                {this.state.sidebarOpen ? (
                                <Sidebar
                                  roomAddress={room.address!}
                                  activeSpeakerView={
                                    this.state.activeSpeakerView
                                  }
                                  toggleActiveSpeakerView={
                                    this.toggleActiveSpeakerView
                                  }
                                  pttMode={this.state.pttMode}
                                  togglePttMode={this.togglePttMode}
                                  setPassword={this.setPassword}
                                  passwordRequired={room.passwordRequired}
                                  roomId={room.id!}
                                  toggleSidebar={this.toggleSidebar}
                                />
                                ) : (
                                  <SidebarToggle 
                                  onClick={this.toggleSidebar}/>
                                )}
                                <PeerGrid
                                  roomAddress={room.address!}
                                  activeSpeakerView={
                                    this.state.activeSpeakerView
                                  }
                                />
                                <Timer>{this.state.timer.mins}:{ this.state.timer.secs < 10 ? `0${ this.state.timer.secs }` : this.state.timer.secs }</Timer>
                                {this.state.chatOpen ? (
                                  <ChatContainer
                                    roomAddress={room.address!}
                                    sendRtt={this.state.sendRtt}
                                    toggleRtt={this.toggleRtt}
                                    toggleChat={this.toggleChat}
                                  />
                                ) : (
                                  <ChatToggle
                                    roomAddress={room.address!}
                                    onClick={this.toggleChat}
                                  />
                                )}
                              </Container>
                            </RootContainer>
                          </HiddenPeers.Provider>
                        );
                      }}
                    </Room>
                  </Connected>
                </>
              )}
            </>
          )}
        />
        </DeviceSet.Provider>
      </Provider>
    );
  }

  private toggleActiveSpeakerView = () => {
    this.setState({ activeSpeakerView: !this.state.activeSpeakerView });
  };

  private toggleRtt = () => {
    this.setState({ sendRtt: !this.state.sendRtt });
  };

  private togglePttMode = (e: React.SyntheticEvent) => {
    this.setState({ pttMode: !this.state.pttMode }, () => {
      if (this.state.pttMode) {
        document.addEventListener('keydown', this.unmute);
        document.addEventListener('keyup', this.mute);
        window.addEventListener('blur', this.props.mute!);
        this.props.mute!();
      } else {
        document.removeEventListener('keydown', this.unmute);
        document.removeEventListener('keyup', this.mute);
        window.removeEventListener('blur', this.props.mute!);
        this.props.unmute!();
      }
    });

    if (e.target) {
      (e.target as HTMLElement).blur();
    }
  };

  private mute = (e: KeyboardEvent) => {
    if (e.key === ' ') {
      this.props.mute!();
    }
  };

  private unmute = (e: KeyboardEvent) => {
    if (e.key === ' ') {
      this.props.unmute!();
    }
  };

  private setPassword = (password: string) => {
    this.setState({ password });
  };

  private toggleChat = () => {
    this.setState({ chatOpen: !this.state.chatOpen });
  };

  private toggleSidebar = () => {
    this.setState({ sidebarOpen: !this.state.sidebarOpen });
  };

  private togglePeer = (peerId: string) => {
    if (this.state.hiddenPeers.includes(peerId)) {
      const hiddenPeers = [...this.state.hiddenPeers];
      const index = hiddenPeers.indexOf(peerId);
      hiddenPeers.splice(index);
      this.setState({ hiddenPeers });
    } else {
      this.setState({ hiddenPeers: [...this.state.hiddenPeers, peerId] });
    }
  };
}

function mapDispatchToProps(dispatch: any, props: Props): Props {
  return {
    ...props,
    mute: () => dispatch(Actions.muteSelf()),
    unmute: () => dispatch(Actions.unmuteSelf())
  };
}

export default connect(
  null,
  mapDispatchToProps
)(Index);
