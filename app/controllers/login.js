import Ember from 'ember';
import ENV from '../config/environment';

import fetch from 'fetch';

/* global require */
const { remote, ipcRenderer } = require('electron');

const BrowserWindow = remote.BrowserWindow;
let authWindow = null;

export default Ember.Controller.extend({
  dataService: Ember.inject.service(),
  init() {
    ipcRenderer.on('code-request', (event, code) => {
      const slackOptions = ENV.slack;
      this.requestSlackToken(slackOptions, code);
      authWindow.destroy();
    });
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
          Ember.$('.status').addClass('visible');
          localStorage.setItem('token', data.access_token);
          this.setupUserAndTeamData(data);
        }
      });
    }).catch((err) => {
      console.log(err);
    });
  },

  setupUserAndTeamData(data) {
    const _this = this;
    const dataService = this.get('dataService');
    dataService.setupUserAndTeamData(data).then(() => {
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
