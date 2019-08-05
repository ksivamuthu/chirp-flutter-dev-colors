import React, { Component, Fragment } from 'react';
import './App.css';
import GoogleFontLoader from 'react-google-font-loader';
import { IconButton, ListItem, List, ListItemText, Divider, ListItemIcon, TextField, Button, Grid, AppBar, Toolbar, Typography } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLightbulb, faSync } from '@fortawesome/free-solid-svg-icons'
import ChirpConnect from 'chirp-js-sdk'

const chirp = new ChirpConnect('43790CCAde71e7bD92bb74bEb')
chirp.setConfig('standard');

const primaryText = {
  fontSize: '24px',
  marginLeft: '15px'
};

const secondaryText = {
  fontSize: '18px',
  marginLeft: '15px'
};

class App extends Component {
  _username = '';
  constructor() {
    super();
    this.state = { data: null, username: '' };
  }
  componentDidMount() {
    this._username = window.localStorage['username'] || '';
    this.setState({ username: this._username });
    fetch('/api/devcolors').then(response => response.json())
      .then(data => this.setState({ data: data }));
  }

  handleClick(item) {
    const payload = new TextEncoder('utf-8').encode(JSON.stringify({ n: this.state.username, c: item.color }));
    chirp.send(payload)
  }

  onSaveClicked() {
    this.setState({ username: this._username });
    window.localStorage['username'] = this._username;
  }

  handleChange(event) {
    this._username = event.target.value;
  }

  resetData() {
    window.localStorage['username'] = '';
    this.setState({ username: '' });
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
        <div>
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h5" style={{ flexGrow: 1 }}>
                Chirping Devices
               </Typography>
              <IconButton onClick={this.resetData.bind(this)}>
                <FontAwesomeIcon icon={faSync} color={"white"} />
              </IconButton>
            </Toolbar>
          </AppBar>
          <div className="App">
            {!this.state.username && <Grid container spacing={0}
              direction="column"
              alignItems="center"
              justify="center">
              <TextField
                style={{ width: "100%" }}
                required
                id="outlined-required"
                label="Please enter your name" s
                placeholder="Name"
                margin="normal"
                onChange={this.handleChange.bind(this)}
                variant="outlined"
              />
              <Grid item>
                <Button onClick={this.onSaveClicked.bind(this)} style={{ width: "120px" }} variant="contained" color="primary">
                  Save
              </Button>
              </Grid>
            </Grid>}
            {this.state.username && <Fragment>
              <Typography variant="h4">
                Welcome {this.state.username}
              </Typography>
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
                </div>
                }
              </List>
            </Fragment>
            }
          </div>
        </div>
      </Fragment>
    );
  }
}

export default App;
