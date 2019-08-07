import React, { Component, Fragment } from 'react';
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLightbulb } from '@fortawesome/free-solid-svg-icons'
import GoogleFontLoader from 'react-google-font-loader';
import socketIOClient from 'socket.io-client';

class App extends Component {
  constructor() {
    super();
    this.state = { copmode: false, name: '', color: '#000000', listening: false, error: '' };
  }

  isCopModeInProgress = false;

  componentDidMount() {
    const socket = socketIOClient('localhost:3001');
    socket.on('ChirpDataReceived', async (data) => {
      if (this.isCopModeInProgress) {
        return;
      }
      if (data === 'cop') {
        this.isCopModeInProgress = true;
        for (var i = 0; i <= 20; i++) {
          await this.sleep(200);
          this.setState({ copmode: true, name: 'COP Mode', color: '#FF0000', listening: false });
          await this.sleep(200);
          this.setState({ copmode: true, name: 'COP Mode', color: '#0000FF', listening: false });
          await this.sleep(50);
        }
        this.setState({ copmode: true, name: '', color: '#000000', listening: false });

        this.isCopModeInProgress = false;
      } else {
        this.setState({ copmode: false, name: 'A device', color: data, listening: false });
      }
    });

    socket.on('ChirpListening', (data) => {
      if (this.isCopModeInProgress) {
        return;
      }
      this.setState({ name: '', listening: true, error: '' });
    });

    socket.on('ChirpError', (data) => {
      if (this.isCopModeInProgress) {
        return;
      }
      this.setState({ color: '#000000', name: '', listening: false, error: data });
    });
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  render() {
    return (
      <Fragment>
        <GoogleFontLoader
          fonts={[
            {
              font: 'Open Sans',
              weights: [400, '400i'],
            }
          ]}
        />
        <div className="App">
          <h1>Chirping Devices</h1>
          <FontAwesomeIcon style={{ "color": this.state.color }} className="bulb" icon={faLightbulb} />
          {this.state.name && this.state.color && <h1>{this.state.name} chirps {this.state.color}</h1>}
          {this.state.listening && <h1>Listening...</h1>}
          {this.state.error && <h1>{this.state.error}</h1>}
        </div>
      </Fragment>
    );
  }
}

export default App;
