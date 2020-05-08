import { LocalMediaList, UserControls } from '@andyet/simplewebrtc';
import React from 'react';
import styled from 'styled-components';
import { TalkyButton } from '../styles/button';
import { colorToString } from '../utils/colorify';
import icon from '../icons/Endlink Logo Bug White.png';

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
padding: 8px;
border: none;
img{
  height: 25px;
  vertical-align: middle
}
:disabled{
  background-color: #323132;
}
span{
  font-size: 16px;
  vertical-align: middle;
}
`;

// ShareControls renders a button that when pressed will share all media that
// is populated in LocalMediaList.
const ShareControls: React.SFC = () => (
  <LocalMediaList
    shared={false}
    render={({ media, shareLocalMedia, removeMedia }) => {

      const shareAll = () => {
        for (const m of media) {
          shareLocalMedia!(m.id);
        }
      };

      const audioPresent = media.filter(m => m.kind=="audio")
      
      return (
        <Container>
            <JoinButton disabled={audioPresent.length===0} onClick={shareAll}><img src={icon}/><span>Start eVisit</span></JoinButton>
          </Container>
      );
    }}
  />
);

export default ShareControls;
