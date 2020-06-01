import {
  DeviceList,
  LocalMediaList,
  Media,
  RequestUserMedia,
  UserControls
} from '@andyet/simplewebrtc';
import React from 'react';
import styled, { css } from 'styled-components';
import Placeholders from '../contexts/Placeholders';
import { Speaker } from './Icons';
import logo from '../icons/logo.png';
import { TalkyButton } from '../styles/button';
import mq from '../styles/media-queries';
import { Error, Info } from './Alerts';
import DeviceDropdown from './DeviceDropdown';
import DeviceSelector from './DeviceSelector';
import DisplayNameInput from './DisplayNameInput';
import InputChecker from './InputChecker';
import MediaPreview from './MediaPreview';
import { MicroPhone, SettingsIcon, VideocamIcon, Dropdown } from './Icons';
import ShareControls from './ShareControls';

import getConfigFromMetaTag from '../utils/metaConfig';
import { createSoundPlayer } from '../utils/sounds';

const Container = styled.div({
  display: 'grid',
  gridTemplateAreas: `
    'header'
    'preview'
    'controls'
  `,
  padding: '30px',
  [mq.SMALL_DESKTOP]: {
    padding: '30px',
    gridGap: '0px',
    gridTemplateColumns: 'min-content',
    gridTemplateAreas: `
      'preview header'
      'controls logoDisplay'
    `,
    columnGap: '5%',
  },
});

const Header = styled.div`
  grid-area: header;
  h2 {
    margin-bottom: 20px;
  }
`;

const LogoDisplay = styled.div`
${mq.SMALL_DESKTOP} {
  grid-area: logoDisplay;
  position: relative;
  img {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 350px;
  }
  }
  padding: 18%;
`;

const Controls = styled.div`
  grid-area: controls;
  padding: 30px;
  padding-top: 5px;    
  height: fit-content;
  background-color: #18181a;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  ${mq.SMALL_DESKTOP} {
    // width: 300px;
  }
  select {
    border: 1px solid #919192;
    color: white;
    height: 40px;
    padding: 5px;
    padding-right: 25px;
    margin-top: 5px;
    background-color: transparent;
    font-size: 14px;
    width: 100%;
    border-radius: 10px;
    outline: 0;
    -webkit-appearance: none;
  }
  svg {
    fill: #919192;
    width: 7%;
  }
  .videoCamIcon{
    svg{
      width: 7%;
    }
  }
  label {
    display: block;
    // font-weight: bold;
    font-size: 16px;
    margin-top: 5px;
    margin-bottom: 10px;
    color: #919192;
    svg {
      width: 5%;
      vertical-align: middle;
      margin-right: 10px;
      fill: #919192;
    }
    .dropdownIcon{
    float: right;
    width: 14px !important;
    margin-top: -27px;
    margin-right: 5px !important;
    pointer-events: none;
    padding-right: 5px;
    }
  }
`;

const SettingsSelector = styled.div({
  textAlign: 'right',
  width: '102%',
  fontSize: '30px',
});

const Preview = styled.div({
  gridArea: 'preview',
  display: 'flex',
  alignItems: 'flex-end',
  flexDirection: 'column',
  backgroundColor: '#323132',
  borderTopLeftRadius: '10px',
  borderTopRightRadius: '10px',
}, `
.eyjURU{
  padding: 0px;
}
input{
  width: 100%;
  border-radius: 10px;
  background-color: transparent;
  border: none;
  height: 35px;
  padding: 10px;
  outline: none;
  caret-color: #4284f3;
}
`);

const Input = styled.input`
  width: 100%;
  border-radius: 10px;
  background-color: transparent;
  border: none;
  height: 35px;
  padding: 10px;
  outline: none;
  caret-color: #4284f3;
`;

const PermissionButton = styled(TalkyButton)({
  marginBottom: '5px',
  width: '100%',
});

const TestOutputButton = styled.button`
  color: #4284f3;
  float: right;
  background-color: transparent;
  border: none;
  outline: none;
  font-size: 15px;
`;

type GetMedia = (
  additional?: MediaStreamConstraints
) => Promise<{ audio?: string; video?: string }>;

export interface HaircheckProps {
  onAccept?: () => void;
}
export interface HaircheckState {
  allowInitialAutoCapture: boolean;
  previewAudioId?: string;
  previewVideoId?: string;
  testingOutput: boolean;
}

function getDeviceForTrack(devices: MediaDeviceInfo[], track: MediaStreamTrack) {
  let deviceId: string | undefined;
  const deviceLabel = track.label;
  const deviceKind = `${track.kind}input`;

  if (track.getSettings) {
    const settings = track.getSettings();
    deviceId = settings.deviceId;
  }

  if (deviceId) {
    for (const device of devices) {
      if (device.deviceId === deviceId) {
        return device;
      }
    }
  }
  for (const device of devices) {
    if (deviceLabel === device.label && deviceKind === device.kind) {
      return device;
    }
  }
}

const hasTestOutput = getConfigFromMetaTag('sound-test-output');
console.log(hasTestOutput);
const throttledTestOutput = createSoundPlayer('sound-test-output');
console.log(throttledTestOutput)


class Haircheck extends React.Component<HaircheckProps, HaircheckState> {
  constructor(props: HaircheckProps) {
    super(props);

    this.state = {
      allowInitialAutoCapture: true,
      testingOutput: false
    };
  }

  public render() {
    return (
      <LocalMediaList
        screen={false}
        render={({ media, removeMedia, shareLocalMedia }) => {
          const previewVideo = media.filter(m => m.id === this.state.previewVideoId)[0];
          const previewAudio = media.filter(m => m.id === this.state.previewAudioId)[0];

          return (
            <Container>
              <Placeholders.Consumer>
                {({ haircheckHeaderPlaceholder }) => (
                  <Header
                    ref={node => {
                      if (node && haircheckHeaderPlaceholder && node.childElementCount === 0) {
                        const el = haircheckHeaderPlaceholder();
                        if (el) {
                          node.appendChild(el);
                        }
                      }
                    }}
                  />
                )}
              </Placeholders.Consumer>
              <Preview>
                <UserControls
                  render={({
                    user,
                    setDisplayName
                  }) => (
                      <DisplayNameInput
                        displayName={user.displayName}
                        setDisplayName={setDisplayName}
                      />
                    )}
                />
                <MediaPreview video={previewVideo} audio={previewAudio} />
              </Preview>
              <Controls>
                <DeviceList
                  render={({
                    devices,
                    hasCamera,
                    requestingCameraCapture,
                    cameraPermissionDenied,
                    hasMicrophone,
                    requestingMicrophoneCapture,
                    microphonePermissionDenied,
                    cameraPermissionGranted,
                    microphonePermissionGranted,
                    requestingCapture
                  }) => {
                    const audioInputs = devices.filter(d => d.kind === 'audioinput');
                    const audioOutputs = devices.filter(d => d.kind === 'audiooutput');
                    const videoInputs = devices.filter(d => d.kind === 'videoinput');

                    const currentAudioDevice = previewAudio
                      ? getDeviceForTrack(devices, previewAudio.track)
                      : undefined;
                    const currentVideoDevice = previewVideo
                      ? getDeviceForTrack(devices, previewVideo.track)
                      : undefined;

                    return (
                      <>
                        {this.initialAutoCapture(
                          microphonePermissionGranted,
                          cameraPermissionGranted,
                          requestingCapture
                        )}
                        <div>
                          <UserControls
                            render={({ user, setAudioOutputDevice }) => (
                              <label>
                                <Speaker />
                                <span>Speaker:</span>
                                {hasTestOutput && (
                                  <TestOutputButton
                                    onClick={async e => {
                                      e.preventDefault();
                                      this.setState({ testingOutput: true });
                                      await throttledTestOutput(user.audioOutputDeviceId);
                                      this.setState({ testingOutput: false });
                                      return false;
                                    }}
                                  >
                                    {this.state.testingOutput ? 'Playing...' : 'Test Speaker'}
                                  </TestOutputButton>
                                )}
                                <select
                                  defaultValue={user.audioOutputDeviceId}
                                  disabled={!devices.length}
                                  onChange={e => {
                                    setAudioOutputDevice(e.target.value);
                                  }}
                                >
                                  {audioOutputs.length &&
                                    audioOutputs.map(device => (
                                      <option key={device.deviceId} value={device.deviceId}>
                                        {device.label}
                                      </option>
                                    ))}
                                  {!audioOutputs.length && (
                                    <option key="" value="">
                                      Default
                                    </option>
                                  )}
                                </select>
                                <Dropdown />
                              </label>
                            )}
                          />
                        </div>
                        <div>
                          <label>
                            <VideocamIcon />
                            <span>Camera:</span>
                            {this.renderInputSelector(
                              'video',
                              hasCamera,
                              cameraPermissionGranted,
                              cameraPermissionDenied,
                              requestingCameraCapture!,
                              videoInputs,
                              currentVideoDevice,
                              currentAudioDevice,
                              previewVideo,
                              previewAudio,
                              removeMedia,
                              'No cameras detected.',
                              'Camera permissions denied.',
                              'Requesting cameras...',
                              'Allow camera access',
                              'Disable Camera'
                            )}
                            <Dropdown />
                          </label>
                        </div>
                        <div>
                          <label>
                            <MicroPhone />
                            <span>Microphone:</span>
                            {this.renderInputSelector(
                              'audio',
                              hasMicrophone,
                              microphonePermissionGranted,
                              microphonePermissionDenied,
                              requestingMicrophoneCapture!,
                              audioInputs,
                              currentAudioDevice,
                              currentVideoDevice,
                              previewAudio,
                              previewVideo,
                              removeMedia,
                              'No microphones detected.',
                              'Microphone permissions denied.',
                              'Requesting microphones...',
                              'Allow microphone access',
                              'Disable Microphone'
                            )}
                            <Dropdown />
                          </label>
                        </div>
                        <ShareControls />
                      </>
                    );
                  }}
                />
              </Controls>
              {/* <Controls>
                <div>
                  <SettingsSelector>
                    <SettingsIcon />
                  </SettingsSelector>
                </div>
                <div>
                  <DeviceSelector
                    kind="video"
                    render={({
                      hasDevice,
                      permissionDenied,
                      requestingCapture,
                      requestPermissions,
                      devices,
                      currentMedia,
                      selectMedia,
                    }) => {
                      if (true) {
                        // console.log(
                        //   hasDevice,
                        //   permissionDenied,
                        //   requestingCapture,
                        //   requestPermissions,
                        //   devices,
                        //   currentMedia,
                        //   selectMedia,
                        //   'requestPermissions'
                        // );
                      }
                      if (hasDevice === false) {
                        return <Error>No cameras detected.</Error>;
                      }

                      if (permissionDenied === true) {
                        return <Error>Camera permissions denied.</Error>;
                      }

                      if (requestingCapture === true) {
                        return <Info>Requesting cameras...</Info>;
                      }

                      if (requestPermissions) {
                        return (
                          <PermissionButton onClick={requestPermissions}>
                            <VideocamIcon />
                            <span>Allow camera access</span>
                          </PermissionButton>
                        );
                      }

                      return (
                        <label className="videoCamIcon">
                          <VideocamIcon />
                          <span>My Camera</span>
                          <DeviceDropdown
                            currentMedia={currentMedia!}
                            devices={devices!}
                            selectMedia={selectMedia!}
                          />
                        </label>
                      );
                    }}
                  />
                </div>
                <div>
                  <DeviceSelector
                    kind="audio"
                    render={({
                      hasDevice,
                      permissionDenied,
                      requestingCapture,
                      requestPermissions,
                      devices,
                      currentMedia,
                      selectMedia,
                    }) => {
                      if (hasDevice === false) {
                        return <Error>No microphones detected.</Error>;
                      }

                      if (permissionDenied === true) {
                        return <Error>Microphone permissions denied.</Error>;
                      }

                      if (requestingCapture === true) {
                        return <Info>Requesting microphones...</Info>;
                      }

                      if (requestPermissions) {
                        return (
                          <PermissionButton onClick={requestPermissions}>
                            <MicroPhone />
                            <span>Allow microphone access</span>
                          </PermissionButton>
                        );
                      }

                      return (
                        <>
                          <label>
                            <MicroPhone />
                            <span>My Microphone</span>
                            <DeviceDropdown
                              currentMedia={currentMedia!}
                              devices={devices!}
                              selectMedia={selectMedia!}
                            />
                          </label>
                          <InputChecker
                            media={currentMedia!}
                            threshold={7000}
                            render={({ detected, lost }) => {
                              if (detected && lost) {
                                return <Error>Media lost.</Error>;
                              }

                              if (!detected) {
                                return (
                                  <Info>No input detected from your microphone.</Info>
                                );
                              }

                              return null;
                            }}
                          />
                        </>
                      );
                    }}
                  />
                </div>
                <ShareControls />
              </Controls> */}
              <LogoDisplay>
                <img src={logo} />
              </LogoDisplay>
            </Container>
          );
        }}
      />
    );
  }
  private initialAutoCapture(
    microphonePermissionGranted: boolean,
    cameraPermissionGranted: boolean,
    requestingCapture?: boolean
  ) {
    const auto =
      this.state.allowInitialAutoCapture &&
      (microphonePermissionGranted || cameraPermissionGranted) &&
      !requestingCapture &&
      !this.state.previewAudioId &&
      !this.state.previewVideoId;
    if (!auto) {
      return null;
    }

    setTimeout(() => {
      this.setState({
        allowInitialAutoCapture: false
      });
    }, 0);

    return (
      <RequestUserMedia
        share={false}
        auto={auto}
        audio={microphonePermissionGranted}
        video={cameraPermissionGranted}
        replaceAudio={this.state.previewAudioId}
        replaceVideo={this.state.previewVideoId}
        onError={() => {
          this.setState({
            allowInitialAutoCapture: false
          });
        }}
        onSuccess={ids => {
          this.setState({
            allowInitialAutoCapture: false,
            previewAudioId: ids && ids.audio,
            previewVideoId: ids && ids.video
          });
        }}
        render={() => null}
      />
    );
  }

  private renderInputSelector(
    kind: 'audio' | 'video',
    hasDevice: boolean,
    permissionGranted: boolean,
    permissionDenied: boolean,
    requestingCapture: boolean,
    devices: MediaDeviceInfo[],
    currentDevice: MediaDeviceInfo | undefined,
    currentOtherDevice: MediaDeviceInfo | undefined,
    preview: Media,
    otherPreview: Media,
    removeMedia: (id: string) => void,
    noDevicesLabel: string,
    noPermissionLabel: string,
    capturingLabel: string,
    requestPermissionLabel: string,
    disableLabel: string
  ) {
    if (hasDevice === false) {
      return <Error>{noDevicesLabel}</Error>;
    }
    if (permissionDenied) {
      return <Error>{noPermissionLabel}</Error>;
    }
    if (requestingCapture) {
      return <Info>{capturingLabel}</Info>;
    }

    const constraints: MediaTrackConstraints = {
      [kind]: true,
      [kind === 'audio' ? 'video' : 'audio']: currentOtherDevice
        ? {
          deviceId: { exact: currentOtherDevice.deviceId }
        }
        : !!otherPreview
    };

    return (
      <RequestUserMedia
        share={false}
        {...constraints}
        replaceAudio={this.state.previewAudioId}
        replaceVideo={this.state.previewVideoId}
        render={getMedia => {
          if (!preview && !permissionGranted) {
            return (
              <PermissionButton
                onClick={() => {
                  this.runGetMedia(getMedia);
                }}
              >
                <span>{requestPermissionLabel}</span>
              </PermissionButton>
            );
          } else {
            return (
              <select
                value={currentDevice ? currentDevice.deviceId : 'disable'}
                onChange={e => {
                  const deviceId = e.target.value;
                  if (!deviceId) {
                    return;
                  }

                  this.setState({ allowInitialAutoCapture: false });
                  if (deviceId !== 'disable') {
                    this.runGetMedia(getMedia, {
                      [kind]: {
                        deviceId: { exact: deviceId }
                      }
                    });
                  } else {
                    if (kind === 'audio') {
                      removeMedia(this.state.previewAudioId!);
                      this.setState({ previewAudioId: undefined });
                    } else {
                      removeMedia(this.state.previewVideoId!);
                      this.setState({ previewVideoId: undefined });
                    }
                  }
                  if (!e.target.value) {
                    return;
                  }
                }}
              >
                {devices.map(device => (
                  <option key={device.deviceId} value={device.deviceId}>
                    {device.label}
                  </option>
                ))}
                <option key="disabled" value="disable">
                  {disableLabel}
                </option>
              </select>
            );
          }
        }}
      />
    );
  }

  private runGetMedia(getMedia: GetMedia, additional?: MediaStreamConstraints): void {
    this.setState({ allowInitialAutoCapture: false });
    getMedia(additional).then(ids => {
      this.setState({
        previewAudioId: ids && ids.audio,
        previewVideoId: ids && ids.video
      });
    });
  }
}

export default Haircheck;
