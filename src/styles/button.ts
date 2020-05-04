import styled, { CSSObject } from 'styled-components';
import { colorToString } from '../utils/colorify';

const TalkyButton = styled.button`
  border-radius: 10px;
  // transition: background 200ms linear;
  font-size: 14px;
  min-height: 30px;
  min-width: 30px;
  border-color: #919192;
  border-style: solid;
  border-width: 1px;
  text-align: left;
  color: #919192;
  background-color: transparent;
  outline: none;
  :active {
    background-color: #4284f3;
    color: white;
    svg {
      fill: white;
    }
  }
  svg {
    fill: #919192;
    vertical-align: middle;
    font-size: 20px;
    :not(:only-child) {
      margin-left: 7px;
    }
  }
  & a {
    color: ${({ theme }) => colorToString(theme.buttonSecondaryText)};
  }
  & span {
    padding-left: 3px;
    padding-right: 3px;
    margin-right: 5px;
  }
`;

const buttonBase: CSSObject = {
  borderRadius: '5px',
  transition: 'background 200ms linear',
  fontSize: '14px',
  minHeight: '30px',
  minWidth: '30px',
  border: 'none',
  color: '#505658',
  backgroundColor: '#e9ecec',
  '&:hover': {
    backgroundColor: '#cdd3d5'
  },
  '&:focus': {
    outline: 0
  },
  '& svg': {
    fill: '#505658',
    verticalAlign: 'middle',
    fontSize: '20px',
    '&:not(:only-child)': {
      marginLeft: '7px'
    }
  },
  '& a': {
    color: '#505658'
  },
  '& span': {
    paddingLeft: '3px',
    paddingRight: '3px',
    marginRight: '5px'
  }
};

export { buttonBase, TalkyButton };
