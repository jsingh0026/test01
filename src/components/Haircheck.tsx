import { LocalMediaList, UserControls } from '@andyet/simplewebrtc';
import React from 'react';
import styled, { css } from 'styled-components';
import Placeholders from '../contexts/Placeholders';
import logo from '../icons/logo.png';
import { TalkyButton } from '../styles/button';
import mq from '../styles/media-queries';
import { Error, Info } from './Alerts';
import DeviceDropdown from './DeviceDropdown';
import DeviceSelector from './DeviceSelector';
import DisplayNameInput from './DisplayNameInput';
import InputChecker from './InputChecker';
import MediaPreview from './MediaPreview';
import { MicroPhone, SettingsIcon, VideocamIcon } from './Icons';
import ShareControls from './ShareControls';

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

const Haircheck: React.SFC = () => (
  <Container>
    <Placeholders.Consumer>
      {({ haircheckHeaderPlaceholder }) => (
        <Header
          ref={node => {
            if (
              node &&
              haircheckHeaderPlaceholder &&
              node.childElementCount === 0
            ) {
              const el = haircheckHeaderPlaceholder();
              if (el) {
                node.appendChild(el);
              }
            }
          }}
        />
      )}
    </Placeholders.Consumer>
    <Header />
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
      <LocalMediaList
        screen={false}
        render={({ media }) => {
          const audioStreams = media.filter(m => m.kind === 'audio');
          const videoStreams = media.filter(m => m.kind === 'video');
          const latestAudio = audioStreams[audioStreams.length - 1];
          const latestVideo = videoStreams[videoStreams.length - 1];

          return <MediaPreview video={latestVideo} audio={latestAudio} />;
        }}
      />
    </Preview>
    <Controls>
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
    </Controls>
    <LogoDisplay>
      <img src={logo} />
    </LogoDisplay>
  </Container>
);

export default Haircheck;
