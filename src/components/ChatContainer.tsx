import {
  Chat,
  ChatComposers,
  ChatInput,
  ChatList,
  Peer,
  StayDownContainer
} from '@andyet/simplewebrtc';
import KeyboardArrowDownIcon from 'material-icons-svg/components/baseline/KeyboardArrowDown';
import React from 'react';
import styled, { css } from 'styled-components';
import mq from '../styles/media-queries';
import emojify from '../utils/emojify';
import Linkify from './Linkify';

const Container = styled.div`
  display: flex;
  margin: 3px;
  flex-direction: column;
  min-height: 50vh;
  max-height: 100vh;
  z-index: 300;
  background-color: #2a2829;
  overflow: hidden;
  border-top-right-radius: 10px;
  border-top-left-radius: 10px
  ${mq.SMALL_DESKTOP} {
    width: 250px;
  }
  ${mq.MOBILE} {
    background-color: transparent;
  }
`;

// const staydownContainerClass = css`
//   flex: 1;
//   overflow: scroll;
//   height: 0px; /* This is important to get Flexbox to overflow properly. */
//   margin-bottom: 16px;
// `;

const Header = styled.button`
  border: none;
  display: block;
  padding: 8px;
  font-size: 18px;
  outline: none;
  background-color: #323132;
  text-align: left;
  ${mq.MOBILE} {
    text-align: center;
    span{
      vertical-align: middle;
    }
    svg{
      float: none !important;
    }
  }
  svg {
    fill: white;
    vertical-align: middle;
    font-size: 23px;
    margin-right: 5px;
    float: right;
    margin-top: 3px;
  }
`;

const StyledStayDownContainer = styled(StayDownContainer)({
  flex: 1,
  overflow: 'scroll',
  height: '0px',
  marginBottom: '16px',
  'a':{
    color: '#4284f3'
  }
});

const InputContainer = styled.div`
background-color: #232325
  textarea {
    width: 100%;
    height: 100px;
    min-height: 0;
    padding: 8px 12px;
    margin: 0;
    outline: none;
    border: none;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    caret-color: #4284f3;
    display: block;
    font-size: 14px;
    font-family: inherit;
    resize: none;
    background-color: #18181a;
    color: white
  }
  textarea::placeholder{
    color: #919192;
  }
  input {
    margin-right: 5px;
  }
  label {
    font-size: 12px;
  }
`;

const Message = styled.div`
  border-bottom: 1px solid #323132;
  position: relative;
  padding: 10px;
  font-size: 14px;
  p {
    margin: 0;
  }
`;

const MessageAuthor = styled.p({
  fontWeight: 'bold'
});

const MessageTime = styled.span`
  position: absolute;
  top: 10px;
  right: 10px;
  color: white;
  font-size: 12px;
`;

const MessageText = styled.p({
  wordBreak: 'break-all'
});

interface ChatMessageGroupProps {
  chats: Chat[];
  peer: Peer | undefined;
}

const ChatMessageGroup: React.SFC<ChatMessageGroupProps> = ({
  chats,
  peer
}) => (
  <Message key={chats[0].id}>
    <MessageAuthor>
      {chats[0].displayName ? chats[0].displayName : 'Anonymous'}
    </MessageAuthor>
    <MessageTime>{chats[0].time.toLocaleTimeString('en-US').replace(/\:\d+\s/, " ")}</MessageTime>
    {chats.map(message => (
      <MessageText key={message.id}>
        <Linkify text={emojify(message.body)} />
      </MessageText>
    ))}
  </Message>
);

const ComposersContainer = styled.div({
  minHeight: '30px',
  color: '#919192',
  padding: '0px 10px'
});

interface Props {
  roomAddress: string;
  sendRtt: boolean;
  toggleRtt: () => void;
  toggleChat: () => void;
}

// ChatContainer renders all the UI for the chat room inside a Room. It
// includes a message display embedded inside a StayDownContainer so that
// it remains scrolled to the bottom, a ChatInput to type messages, and a
// text element that displays currently typing peers.
const ChatContainer: React.SFC<Props> = ({
  roomAddress,
  sendRtt,
  toggleRtt,
  toggleChat
}) => (
  <Container>
    <Header onClick={toggleChat}>
      <span>Chat</span>
      <KeyboardArrowDownIcon />
    </Header>
    <StyledStayDownContainer>
      <ChatList
        room={roomAddress}
        renderGroup={({ chats, peer }) => (
          <ChatMessageGroup key={chats[0].id} chats={chats} peer={peer} />
        )}
      />
    </StyledStayDownContainer>
    <InputContainer>
      <ChatInput
        room={roomAddress}
        rtt={sendRtt}
        placeholder="Secure Message"
      />
      {/* <label style={{ display: 'block' }}>
        <input type="checkbox" checked={sendRtt} onChange={toggleRtt} />
        Send as I type
      </label> */}
      <ComposersContainer>
        <ChatComposers room={roomAddress} />
      </ComposersContainer>
    </InputContainer>
  </Container>
);

export default ChatContainer;
