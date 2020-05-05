import { LocalMediaList, UserControls } from '@andyet/simplewebrtc';
import React from 'react';
import styled from 'styled-components';
import { TalkyButton } from '../styles/button';
import { colorToString } from '../utils/colorify';
import icon from '../icons/icon.png';

const Container = styled.div({
  textAlign: 'center',
  marginTop: '20px'
});

// const JoinButton = styled(TalkyButton)`
//   background-color: ${({ theme }) =>
//     colorToString(theme.buttonPrimaryBackground)};
//   font-size: 22px;
//   color: ${({ theme }) => colorToString(theme.buttonPrimaryText)};
//   padding: 10px;
//   :hover {
//     background-color: ${({ theme }) =>
//       colorToString(theme.buttonPrimaryBackgroundHover)};
//     color: ${({ theme }) => colorToString(theme.buttonPrimaryText)};
//   }
//   :active {
//     background-color: ${({ theme }) =>
//       colorToString(theme.buttonPrimaryBackgroundActive)};
//     color: ${({ theme }) => colorToString(theme.buttonPrimaryText)};
//   }
// `;

const JoinButton = styled(TalkyButton)`
background-color: #4284f3;
font-size: 14px;
color: white;
padding: 5px;
img{
  height: 25px;
  filter: brightness(0) invert(1);
}
:disabled{
  background-color: #323132;
}
span{
  vertical-align: super;
}
`;

// ShareControls renders a button that when pressed will share all media that
// is populated in LocalMediaList.
const ShareControls: React.SFC = () => (
  <LocalMediaList
    shared={false}
    render={({ media, shareLocalMedia, removeMedia }) => {
      console.log(media, shareLocalMedia);

      const shareAll = () => {
        for (const m of media) {
          shareLocalMedia!(m.id);
        }
      };
      
      return (<UserControls
        render={({
          user
        }) => (
          <Container>{user.displayName}
              <JoinButton disabled={media.length<2 && user.displayName==''} onClick={shareAll}><img src={icon}/><span>Start eVisit</span></JoinButton>
            </Container>
        )}
      />
      );
    }}
  />
);

export default ShareControls;
