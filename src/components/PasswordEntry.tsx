import React, { Component } from 'react';
import styled, { css } from 'styled-components';
import { TalkyButton } from '../styles/button';
import { colorToString } from '../utils/colorify';

const Container = styled.div`
  text-align: center;
  h2 {
    font-size: 36px;
    color: white;
  }
  input {
    background-color: #323132;
    color: white;
    display: block;
    padding: 7px;
    width: 100%;
    max-width: 450px;
    margin: 0 auto;
    border-radius: 10px;
    border: none;
    margin-bottom: 10px;
    outline: none;
    caret-color: #4284f3;
  }
  button {
    padding: 3px 8px;
    border-radius: 10px;
    outline: 'none';
  }
`;

const SubmitButton = styled.button`
  color: white;
  background-color: #4284f3;
  border: none    
`;

const CancelButton = styled.button({
  marginRight: '10px',
  backgroundColor: '#323132',
  color: 'white',
  border: 'none',
});

interface Props {
  setPassword: (s: string) => void;
  setting: boolean;
  passwordIsIncorrect?: boolean;
  onSubmit?: () => void;
}

interface State {
  password: string;
}

export default class PasswordEntry extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { password: '' };
  }

  public render() {
    return (
      <Container>
        <h2>
          {this.props.setting
            ? 'Set password for this eVisit'
            : 'A password is required to enter this room'}
        </h2>
        <input
          type="password"
          placeholder="eVisit Password"
          value={this.state.password}
          onChange={this.onChange}
        />
        {this.props.passwordIsIncorrect && (
          <div style={{color: 'red', marginBottom: '10px'}}>The password you entered is incorrect. Please try again.</div>
        )}
        <CancelButton onClick={this.props.onSubmit}>Cancel</CancelButton>
        <SubmitButton onClick={this.onClick}>
          {this.props.setting ? 'Confirm' : 'Join'}
        </SubmitButton>
      </Container>
    );
  }

  private onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ password: e.target.value });
  };

  private onClick = () => {
    this.props.setPassword(this.state.password);

    if (this.props.onSubmit) {
      this.props.onSubmit();
    }
  };
}
