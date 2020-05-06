import { ChatComposers, ChatList } from '@andyet/simplewebrtc';
import KeyboardArrowUpIcon from 'material-icons-svg/components/baseline/KeyboardArrowUp';
import MoreHorizIcon from 'material-icons-svg/components/baseline/MoreHoriz';
import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import { colorToString } from '../utils/colorify';
import ChatNotifications from './ChatNotifications';

interface Props {
  roomAddress: string;
  onClick: () => void;
}

interface ContainerProps {
  isTyping: boolean;
  newMessage: boolean;
}

const Container = styled.button<ContainerProps>`
  position: absolute;
  bottom: 1%;
  right: 1%;
  font-size: 18px;
  border-radius: 10px;
  border: 1px solid #4284f3;
  background: #4284f3;
  color: white;
  padding: 4px 10px;
  :focus {
    outline: 0;
  }
  svg {
    fill: white;
    font-size: 24px;
    vertical-align: middle;
    // :last-of-type {
      margin-left: 5px;
      // opacity: ${({ isTyping }) => (isTyping ? 1 : 0)};
    // }
  }
`;

// border: ${({ newMessage, theme }) =>
// newMessage
//   ? css`1px ${colorToString(theme.buttonActionBackground)} solid`
//   : css`1px solid ${colorToString(theme.border)}`};
// background: ${({ newMessage, theme }) =>
// newMessage
//   ? colorToString(theme.buttonActionBackground)
//   : colorToString(theme.background)};
// color: ${({ newMessage, theme }) =>
// newMessage
//   ? colorToString(theme.buttonActionText)
//   : colorToString(theme.foreground)};

const ChatToggle: React.SFC<Props> = ({ roomAddress, onClick }) => {
  const [newMessage, setNewMessage] = useState(false);
  return (
    <ChatList
      room={roomAddress}
      render={({ groups }) => (
        <>
          <ChatComposers
            room={roomAddress}
            render={({ composers }) => (
              <Container
                onClick={onClick}
                isTyping={composers.length > 0}
                newMessage={newMessage}
              >
                <span>Chat</span>
                <KeyboardArrowUpIcon />
                {/* <MoreHorizIcon /> */}
              </Container>
            )}
          />
          <ChatNotifications
            groups={groups}
            onSend={() => null}
            onReceive={() => setNewMessage(true)}
          />
        </>
      )}
    />
  );
};

export default ChatToggle;
