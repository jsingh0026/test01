import CallEndIcon from 'material-icons-svg/components/baseline/CallEnd';
import LockIcon from 'material-icons-svg/components/baseline/Lock';
import LockOpenIcon from 'material-icons-svg/components/baseline/LockOpen';
import React, { CSSProperties } from 'react';
import Modal from 'react-modal';
import styled, { css } from 'styled-components';
import { TalkyButton } from '../styles/button';
import { colorToString } from '../utils/colorify';
import getConfigFromMetaTag from '../utils/metaConfig';
import InviteButton from './InviteButton';
import PasswordEntry from './PasswordEntry';

const LockButton = styled.button({
});

const LeaveButton = styled.button({
});

const Container = styled.div({
  'button':{
    width: '100%',
    backgroundColor: '#323132',
    borderRadius: '10px',
    marginBottom: '10px',
    border: 'none',
    outline: 'none',
  },
  'a':{
    color: 'white'
  },
  position: "absolute",
  bottom: 0,
  textAlign: 'center'
});

const StyledModal = styled(Modal)`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => colorToString(theme.background)};
  position: relative;
  top: calc(50% - 115px);
  bottom: 40px;
  border: ${({ theme }) => css`1px solid ${colorToString(theme.border)}`};
  overflow: auto;
  border-radius: 4px;
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
  backgroundColor: 'rgba(255, 255, 255, 0.75)'
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
            <LockIcon fill="#505658" />
            <span>Locked Room</span>
          </>
        ) : (
          <>
            <LockOpenIcon fill="#505658" />
            <span>Lock Room</span>
          </>
        )}
      </LockButton>
      <a href={leaveUrl ? leaveUrl : '/'}>
        <LeaveButton>
          <CallEndIcon fill="#505658" />
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
