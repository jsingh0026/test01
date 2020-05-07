import { RequestDisplayMedia } from '@andyet/simplewebrtc';
import ShareScreenIcon from 'material-icons-svg/components/baseline/ScreenShare';
import React from 'react';
import styled from 'styled-components';
import { TalkyButton } from '../styles/button';
import mq from '../styles/media-queries';

const Button = styled.button({
  display: 'none',
  [mq.SMALL_DESKTOP]: {
    display: 'block',
    width: '100%',
    textAlign: 'left',
    border: 'none',
    outline: 'none',
    backgroundColor: 'transparent',
    'svg':{
      fill: 'white'
    }
  }
});

const EmptySpacer = styled.span({
  width: '120px'
});

// ScreenshareControls displays a button that activates the screenshare flow.
// It also provides a link to install the screenshare extension if it is
// required by the user's browser.
const ScreenshareControls: React.SFC = () => (
  <RequestDisplayMedia
    render={(getDisplayMedia, sharing) => {
      if (!sharing.available) {
        return <EmptySpacer />;
      }

      return (
        <Button title="Screen Share" onClick={getDisplayMedia}>
          <ShareScreenIcon />
          <span>Share screen</span>
        </Button>
      );
    }}
  />
);

export default ScreenshareControls;
