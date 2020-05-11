import { RequestDisplayMedia, LocalMediaList, PeerList } from '@andyet/simplewebrtc';
import { ScreenIcon } from './Icons'
import React from 'react';
import styled from 'styled-components';
import { TalkyButton } from '../styles/button';
import mq from '../styles/media-queries';

// const Button = styled.button({
//   display: 'none',
//   [mq.SMALL_DESKTOP]: {
//     display: 'block',
//     width: '100%',
//     textAlign: 'left',
//     border: 'none',
//     outline: 'none',
//     backgroundColor: 'transparent',
//     'svg': {
//       fill: 'white',
//       width: '16px',
//       verticalAlign: 'middle',
//       marginRight: '6px'
//     },
//     'span': {
//       verticalAlign: 'middle'
//     }
//   }
// });

const Button = styled.button<ScreenShareProps>`
display: none;
${[mq.SMALL_DESKTOP]}{
  display: block;
  width: 100%;
  text-align: left;
  border: none;
  outline: none;
  border-bottom: ${props => (props.sharing ? '':'1px solid #323132')};
  background-color: ${props => (props.sharing ? '#000000':'#18181a')};
  padding: ${props => (props.sharing? '5px 10px 5px' : '5px 10px 10px')};
  color: ${props => (props.sharing ? '#4284f3' : 'white')};
  border-bottom-left-radius: ${props => (!props.usersAdded && '10px')};
  border-bottom-right-radius: ${props => (!props.usersAdded && '10px')};
  border-bottom: ${props => (!props.usersAdded && 'none')};
  svg{
    fill: ${props => (props.sharing ? '#4284f3' : 'white')};
    width: 16px;
    vertical-align: middle;
    margin-right: 6px;
  }
  span{
    vertical-align: middle;
  }
  }
`;
const EmptySpacer = styled.span({
  width: '120px'
});

interface ScreenShareProps {
  sharing: boolean,
  usersAdded: boolean
}

interface Props {
  roomAddress: string;
}
// ScreenshareControls displays a button that activates the screenshare flow.
// It also provides a link to install the screenshare extension if it is
// required by the user's browser.
const ScreenshareControls: React.SFC<Props> = ({ roomAddress }) => (
  <RequestDisplayMedia
    render={(getDisplayMedia, sharing) => {
      if (!sharing.available) {
        return <EmptySpacer />;
      }

      return (
        <LocalMediaList
          shared={true}
          render={({ media }) => {
            const videos = media.filter((v, i, a) => a.findIndex(t => (t.screenCapture === v.screenCapture)) === i)
            // const video = videos[0];
            // return(
            //   video.screenCapture ? (
            //     <LocalScreen screenshareMedia={video} />
            //   ) : (
            //     <Video key={video.id} media={video} />
            //   )
            // )
            if (videos.length >= 2) {
              return (
                <>
                  {videos.map(m =>
                  m.screenCapture&&
                    <Button sharing={m.screenCapture} usersAdded={true} disabled title="Screen Share" onClick={getDisplayMedia}>
                      <ScreenIcon />
                      <span>Share Screen</span>
                    </Button>
                    // ) : (
                    // <div style={{transform: 'scaleX(-1)'}}>
                    // <Video key={m.id} media={m} />
                    // </div>
                    // )
                  )}
                </>
              );
            } 
            return(<PeerList
              room={roomAddress}
              render={({ peers }) => {
                return <Button sharing={false} usersAdded={peers.length>0} title="Screen Share" onClick={getDisplayMedia}>
                <ScreenIcon />
                <span>Share Screen</span>
              </Button>
              }}
            />)
          }}
        />
      );
    }}
  />
);

export default ScreenshareControls;
