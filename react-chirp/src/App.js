import React, { Component, Fragment } from 'react';
import './App.css';
import GoogleFontLoader from 'react-google-font-loader';
import { ListItem, List, ListItemText, Divider, ListItemIcon } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLightbulb } from '@fortawesome/free-solid-svg-icons'
import ChirpConnect from 'chirp-js-sdk'

const chirp = new ChirpConnect('43790CCAde71e7bD92bb74bEb')
chirp.setConfig('ultrasonic-multichannel');

const primaryText = {
  fontSize: '24px',
  marginLeft: '15px'
};

const secondaryText = {
  fontSize: '18px',
  marginLeft: '15px'
};

class App extends Component {

  constructor() {
    super();
    this.state = { data: null };
  }
  componentDidMount() {
    fetch('/api/devcolors').then(response => response.json())
      .then(data => this.setState({ data: data }));
  }

  handleClick(item) {
    const payload = new TextEncoder('utf-8').encode(item.color)
    chirp.send(payload)
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
          <List className="ColorsList">
            {this.state.data && this.state.data.length > 0 && <div>
              {this.state.data.map((item) => {
                return (
                  <Fragment key={item.title}>
                    <ListItem onClick={() => this.handleClick(item)} button={true} alignItems="flex-start">
                      <ListItemIcon>
                        <FontAwesomeIcon style={{ "color": item.color }} className="bulb" icon={faLightbulb} />
                      </ListItemIcon>
                      <ListItemText
                        primary={item.title}
                        primaryTypographyProps={{ style: primaryText }}
                        secondary={item.subtitle}
                        secondaryTypographyProps={{ style: secondaryText }} />
                    </ListItem>
                    <Divider variant="fullWidth" component="li" />
                  </Fragment>
                )
              })}
            </div>}
          </List>
        </div>
      </Fragment>
    );
  }
}

export default App;
