import { Media } from '@andyet/simplewebrtc';
import React from 'react';
// import Dropdown from '../icons/double-arrows.svg';
import UnfoldMore from 'material-icons-svg/components/baseline/UnfoldMore';
import styled from 'styled-components';

interface Props {
  devices: MediaDeviceInfo[];
  currentMedia: Media;
  selectMedia: (deviceId?: string) => void;
}

const Container = styled.div`
  select{
    -webkit-appearance: none;
    min-width: 313px;
  }
  svg{
  float: right;
  width: 14px !important;
  margin-top: -27px;
  margin-right: 5px !important;
  pointer-events: none;
  padding-right: 5px;
  }
`;
const DeviceDropdown: React.SFC<Props> = ({
  currentMedia,
  devices,
  selectMedia
}) => (
  <Container>
  <select
    defaultValue=""
    onChange={e => {
      if (!e.target.value) {
        return;
      }
      if (e.target.value === 'disable') {
        selectMedia();
      }
      selectMedia(e.target.value);
    }}
  >
    {currentMedia && (
      <option>{currentMedia.track.label || 'Unknown Device'}</option>
    )}
    {currentMedia && <option>---</option>}
    {devices.map(device => (
      <option key={device.deviceId} value={device.deviceId}>
        {device.label}
      </option>
    ))}
    {currentMedia && <option>---</option>}
    {currentMedia && <option value="disable">Disable</option>}
  </select>
  <UnfoldMore/>
  </Container>
);

export default DeviceDropdown;
