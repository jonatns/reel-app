import Ember from 'ember';
import fetch from 'fetch';

/* global require */
const { remote, ipcRenderer } = require('electron');

const BrowserWindow = remote.BrowserWindow;
let authWindow = null;

export default Ember.Controller.extend({
  dataService: Ember.inject.service(),
  init() {
    ipcRenderer.on('code-request', (event, code) => {
      const options = this.get('options');
      this.requestSlackToken(options, code);
      authWindow.destroy();
    });
  },

  options: {
    accessUri: 'https://slack.com/api/oauth.access',
    clientId: '143373541587.144219915428',
    clientSecret: '27e616cc2a9d15633620326fae8de135',
    scopes: ['users.profile:read', 'team:read', 'users:read']
  },

  actions: {

    login() {

      Ember.$('.login-btn').attr('disabled', true);
      Ember.$('.loader').addClass('loading');

      authWindow = new BrowserWindow({
        width: 500,
        height: 500,
        show: false,
        resizable: false,
        titleBarStyle: 'hidden-inset',
        webPreferences: {
          webSecurity: false,
          allowRunningInsecureContent: true
        }
      });

      authWindow.webContents.session.clearStorageData(() => {
        authWindow.loadURL('file://' + __dirname + '/login-view.html');
        authWindow.once('ready-to-show', () => {
          authWindow.show();
        });
        authWindow.on('close', () => {
          Ember.$('.login-btn').removeAttr('disabled');
          Ember.$('.loader').removeClass('loading');
        });
      });
    }
  },
  requestSlackToken(options, code) {
    const uri = `${options.accessUri}?
      client_id=${options.clientId}&
      client_secret=${options.clientSecret}&
      code=${code}`;
    fetch(uri).then((resp) => {
      resp.json().then((data) => {
        if (typeof data.access_token === 'undefined') {
          console.log('Error trying to login');
        } else {
          localStorage.setItem('token', data.access_token);
          Ember.$('.status').addClass('visible');
          this.setupUserAndTeamData(data);
        }
      });
    }).catch((err) => {
      console.log(err);
    });
  },

  setupUserAndTeamData(data) {
    const _this = this;
    this.get('dataService').setupUserAndTeamData(data).then(() => {
      _this.redirect('selection');
    }).catch((err) => {
      console.log(err);
      _this.redirect('login');
    });
  },

  redirect(route) {
    this.transitionToRoute(route);
  }
});
