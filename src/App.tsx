import React, { Component, useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import ThemeProvider from './components/ThemeProvider';
import Placeholders from './contexts/Placeholders';
import Room from './routes/Room';
import { PlaceholderGenerator } from './types';
import { colorToString, darken } from './utils/colorify';
import { UserContext }  from './contexts/userMobileView'

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  .create-room-form-button{
    background-color: #4284f3;
    border-color: #4284f3;
    border-style: solid;
    border-radius: 3px;
  }
`;

const GlobalStyle = createGlobalStyle`
  html {
    box-sizing: border-box;
  }

  *,
  *:before,
  *:after {
    box-sizing: inherit;
  }

  * {
    margin: 0;
    padding: 0;
  }

  body, html {
    margin: 0;
    padding: 0;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
    font-size: 16px;
    line-height: 1.5;
    color: white;
    background-color: #232325;
  }

  a {
    background-color: transparent;
    text-decoration: none;
  }

  button:hover {
    cursor: pointer;
  }
`;

interface Props {
  configUrl: string;
  userData?: string;
  roomName?: string;
  gridPlaceholder: PlaceholderGenerator;
  haircheckHeaderPlaceholder: PlaceholderGenerator;
  emptyRosterPlaceholder: PlaceholderGenerator;
  homepagePlaceholder: PlaceholderGenerator;
}

class App extends Component<Props> {
  setView = view => {
    this.setState({ view: !view });
  };

  state = {
    view: true,
    setView: this.setView
  };

  updateDimensions() {
    if(window.innerWidth > 749) {
      this.setState({view: false});
    }
    if(window.innerWidth < 749){
      this.setState({view: true});
    }
  }

  componentDidMount() {
    this.updateDimensions();
    window.addEventListener("resize", this.updateDimensions.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions.bind(this));
  }
  public render() {
    const {
      roomName,
      configUrl,
      userData,
      gridPlaceholder,
      haircheckHeaderPlaceholder,
      emptyRosterPlaceholder,
      homepagePlaceholder
    } = this.props;
    return (
      <ThemeProvider>
        <UserContext.Provider value={this.state}>
        <Placeholders.Provider
          value={{
            gridPlaceholder,
            haircheckHeaderPlaceholder,
            emptyRosterPlaceholder,
            homepagePlaceholder
          }}
        >
          <div>
            <GlobalStyle />
            <Container>
              {roomName ? (
                <Room
                  name={roomName}
                  configUrl={configUrl}
                  userData={userData}
                />
              ) : (
                <div
                  ref={node => {
                    if (
                      node &&
                      homepagePlaceholder &&
                      node.childElementCount === 0
                    ) {
                      const el = homepagePlaceholder();
                      if (el) {
                        node.appendChild(el);
                      }
                    }
                  }}
                />
              )}
            </Container>
          </div>
        </Placeholders.Provider>
        </UserContext.Provider>
      </ThemeProvider>
    );
  }
}

export default App;