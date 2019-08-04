import React, { Component, Fragment } from 'react';
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLightbulb } from '@fortawesome/free-solid-svg-icons'
import GoogleFontLoader from 'react-google-font-loader';
import socketIOClient from 'socket.io-client';

class App extends Component {
  constructor() {
    super();
    this.state = { color: '#000000', listening: false };
  }
  componentDidMount() {
    const socket = socketIOClient('localhost:3001');
    socket.on('ChirpDataReceived', (data) => {
      this.setState({ color: data, listening: false });
    });

    socket.on('ChirpListening', (data) => {
      this.setState({ listening: true });
    });
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
          {this.state.listening && <h1>Listening...</h1>}
        </div>
      </Fragment>
    );
  }
}

export default App;
