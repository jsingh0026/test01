import CallEndIcon from 'material-icons-svg/components/baseline/CallEnd';
import LockIcon from 'material-icons-svg/components/baseline/Lock';
import LockOpenIcon from 'material-icons-svg/components/baseline/LockOpen';
import { Key, LeaveIcon } from './Icons';
import React, { CSSProperties } from 'react';
import Modal from 'react-modal';
import styled, { css } from 'styled-components';
import { TalkyButton } from '../styles/button';
import { colorToString } from '../utils/colorify';
import getConfigFromMetaTag from '../utils/metaConfig';
import InviteButton from './InviteButton';
import PasswordEntry from './PasswordEntry';
import mq from '../styles/media-queries'

const LockButton = styled.button({
});

const LeaveButton = styled.button({
});

const Container = styled.div({
  [mq.MOBILE]: {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100%',
    padding: '10px',
    height: '0%'
  },
  'button':{
    width: '70%',
    backgroundColor: '#323132',
    borderRadius: '10px',
    marginBottom: '10px',
    border: 'none',
    outline: 'none',
    padding: '4px',
    [mq.MOBILE]: {
      width: '50%',
      color: '#cbcdce'
    }
  },
  'a':{
    color: 'white'
  },
  'svg':{
    height: '16px',
    marginRight: '6px',
    verticalAlign: 'middle',
    fill: 'white',
    [mq.MOBILE]: {
      fill: '#cbcdce'
    }
  },
  'span': {
    verticalAlign: 'middle'
  },
  position: "absolute",
  bottom: 0,
  textAlign: 'center'
});

const StyledModal = styled(Modal)`
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background-color: #18181a;
  position: relative;
  top: calc(50% - 115px);
  bottom: 40px;
  overflow: auto;
  border-radius: 10px;
  outline: none;
  padding: 35px 20px 20px;
  max-width: 600px;
  margin: 0px auto;
  height: 260px;
`;

const modalOverlayStyle: CSSProperties = {
  zIndex: 1000,
  position: 'fixed',
  top: '0',
  left: '0',
  right: '0',
  bottom: '0',
  backgroundColor: 'rgba(0, 0, 0, 0.75)'
};

interface Props {
  shouldShowPasswordModal: boolean;
  passwordRequired: boolean | undefined;
  showPasswordModal: () => void;
  hidePasswordModal: () => void;
  setPassword: (s: string) => void;
}

const RoomControls: React.SFC<Props> = ({
  shouldShowPasswordModal,
  passwordRequired,
  showPasswordModal,
  hidePasswordModal,
  setPassword
}) => {
  const leaveUrl = getConfigFromMetaTag('leave-button-url');
  return (
    <Container>
      <LockButton
        onClick={
          passwordRequired
            ? () => {
                setPassword('');
              }
            : showPasswordModal
        }
      >
        {passwordRequired ? (
          <>
            <Key fill="#4284f3" />
            <span style={{color:'#4284f3'}}>Locked Room</span>
          </>
        ) : (
          <>
            <Key fill="" />
            <span>Lock Room</span>
          </>
        )}
      </LockButton>
      <a href={leaveUrl ? leaveUrl : '/'}>
        <LeaveButton>
          <LeaveIcon />
          <span>Leave eVisit</span>
        </LeaveButton>
      </a>
      <StyledModal
        isOpen={shouldShowPasswordModal}
        onRequestClose={hidePasswordModal}
        style={{ overlay: modalOverlayStyle }}
      >
        <PasswordEntry
          setting={true}
          setPassword={setPassword}
          passwordIsIncorrect={false}
          onSubmit={hidePasswordModal}
        />
      </StyledModal>
    </Container>
  );
};

export default RoomControls;
