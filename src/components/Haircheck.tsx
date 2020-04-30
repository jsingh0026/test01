import { LocalMediaList } from '@andyet/simplewebrtc';
import MicNone from 'material-icons-svg/components/baseline/MicNone';
import SettingsOutlinedIcon from '@material-ui/icons/SettingsOutlined';
import VideocamOutlinedIcon from '@material-ui/icons/VideocamOutlined';
import React from 'react';
import styled, { css } from 'styled-components';
import Placeholders from '../contexts/Placeholders';
import { TalkyButton } from '../styles/button';
import mq from '../styles/media-queries';
import { colorToString } from '../utils/colorify';
import { Error, Info } from './Alerts';
import DeviceDropdown from './DeviceDropdown';
import DeviceSelector from './DeviceSelector';
import InputChecker from './InputChecker';
import MediaPreview from './MediaPreview';
import ShareControls from './ShareControls';
import logo from '../icons/logo.png';

const Container = styled.div({
  display: 'grid',
  gridTemplateAreas: `
    'header'
    'preview'
    'controls'
  `,
  gridRowGap: '10px',
  gridColumnGap: '10px',
  [mq.SMALL_DESKTOP]: {
    padding: '30px',
    gridGap: '0px',
    gridTemplateColumns: 'min-content',
    gridTemplateAreas: `
      'preview header'
      'controls logoDisplay'
    `,
    columnGap: '5%'
  }
});

const Header = styled.div`
  grid-area: header;
  h2{
    margin-bottom: 20px;
  }
 `;

 const LogoDisplay = styled.div`
  grid-area: logoDisplay;
  position: relative;
  img{
    position: absolute;
    bottom: 0;
    right: 0;
    max-width: 40%;
  }
 `;

const Controls = styled.div`
  grid-area: controls;
  padding: 0 10px;
  ${mq.SMALL_DESKTOP} {
    padding: 30px;
    padding-top: 5px;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    background-color: #18181a;
    // width: 300px;
  }
  select {
    border: ${({ theme }) => css`1px solid ${colorToString(theme.border)}`};
    color: ${({ theme }) => colorToString(theme.foreground)};
    height: 40px;
    padding: 10px;
    margin-top: 5px;
    background-color: ${({ theme }) => colorToString(theme.background)};
    font-size: 12px;
    font-weight: bold;
    width: 100%;
  }
  svg{
    fill: #919192;
  }
  label {
    display: block;
    font-weight: bold;
    font-size: 12px;
    margin-top: 10px;
    margin-bottom: 10px;

    svg {
      font-size: 20px;
      vertical-align: middle;
      margin-right: 5px;
      fill: ${({ theme }) => colorToString(theme.foreground)};
    }
  }
`;

const SettingsSelector = styled.div({
  textAlign: 'right',
  width: '104%',
  fontSize: '30px'
});

const Preview = styled.div({
  gridArea: 'preview',
  display: 'flex',
  alignItems: 'flex-end',
  flexDirection: 'column',
  backgroundColor: '#323132',
  borderRadius: '10px'
});

const Input = styled.input`
  width: 100%;
  border-radius: 10px;
  background-color: transparent;
  border: none;
  height: 35px;
  padding: 10px;
`;

const PermissionButton = styled(TalkyButton)({
  marginBottom: '5px',
  width: '100%'
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
      <Input type="text" placeholder="My Name" />
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
          <SettingsOutlinedIcon />
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
            selectMedia
          }) => {
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
                  <VideocamOutlinedIcon />
                  <span>Allow camera access</span>
                </PermissionButton>
              );
            }

            return (
              <label>
                <VideocamOutlinedIcon />
                <span>Camera:</span>
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
            selectMedia
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
                  <MicNone />
                  <span>Allow microphone access</span>
                </PermissionButton>
              );
            }

            return (
              <>
                <label>
                  <MicNone />
                  <span>Microphone:</span>
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
    <LogoDisplay><img src={logo} /></LogoDisplay>
  </Container>
);

export default Haircheck;
