import { ChatComposers, ChatList } from '@andyet/simplewebrtc';
import KeyboardArrowUpIcon from 'material-icons-svg/components/baseline/KeyboardArrowUp';
import MoreHorizIcon from 'material-icons-svg/components/baseline/MoreHoriz';
import React, { useState, useEffect } from 'react';
import styled, { css } from 'styled-components';
import { colorToString } from '../utils/colorify';
import ChatNotifications from './ChatNotifications';
import mq from '../styles/media-queries';

interface Props {
  onClick: () => void;
}

const Container = styled.button`
  position: absolute;
  bottom: 1%;
  left: 1%;
  font-size: 18px;
  border-radius: 10px;
  z-index: 300;
  span {
    vertical-align: middle;
  }
  border: none;
  background-color: #323132;
  color: white;
  padding: 4px 10px;
  :focus {
    outline: 0;
  }
  svg {
    fill: white;
    font-size: 24px;
    vertical-align: middle;
    margin-left: 5px;
  }
`;


const DISPLAY_NAME_SETTINGS_KEY = '@andyet/talky-core-settings.nick';

function getLocalDisplayName() {
  const name = localStorage.getItem(DISPLAY_NAME_SETTINGS_KEY) || '';

  // The old talky-core saved all data by first JSON stringifying,
  // then JSON parsing on load. So we need to convert old data to
  // the new format:
  if (name === '"null"') {
    return null;
  }
  if (name.startsWith('"') && name.endsWith('"')) {
    return name.substring(1, name.length - 1); 
  }
  return name;
}

const SidebarToggle: React.SFC<Props> = ({ onClick }) => {
  const [displayName, setDisplayName] = useState('Anonymous');
  useEffect(()=>{
    const userName = getLocalDisplayName();
    setDisplayName(userName);
  })
  return (
    <Container
      onClick={onClick}
    >
      <span>{displayName}</span>
      <KeyboardArrowUpIcon />
      {/* <MoreHorizIcon /> */}
    </Container>
  );
};

export default SidebarToggle;
