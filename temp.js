import Ember from 'ember';
import fetch from 'fetch';

const { remote } = require('electron');

const BrowserWindow = remote.BrowserWindow;

export default Ember.Controller.extend({
  actions: {
    login() {

      Ember.$('.login-btn').attr('disabled', true);
      Ember.$('.loader').addClass('loading');

      const _this = this;
      let authWindow = null;
      var options = {
        host: 'https://slack.com/api/oauth.access',
        client_id: '143373541587.144219915428',
        client_secret: '27e616cc2a9d15633620326fae8de135',
        scopes: ['identity.basic', 'identity.team', 'identity.avatar']
      };

      authWindow = new BrowserWindow({
        width: 600,
        height: 500,
        show: false,
        resizable: false,
      });
      var slackUrl = 'https://slack.com/oauth/authorize?';
      var authUrl = slackUrl + 'scope=' + options.scopes + '&client_id=' + options.client_id;
      authWindow.loadURL(authUrl);

      authWindow.webContents.on('did-get-redirect-request', (event, oldUrl, newUrl) => {
        handleCallback(newUrl);
      });

      authWindow.webContents.on('did-get-response-details', () => {
        authWindow.show();
      });

      authWindow.on('close', () => {
          authWindow = null;
      }, false);

      function handleCallback(url) {
        var raw_code = /code=([^&]*)/.exec(url) || null;
        var code = (raw_code && raw_code.length > 1) ? raw_code[1] : null;
        var error = /\?error=(.+)$/.exec(url);

        if (code || error) {
          authWindow.destroy();
        }

        if (code) {
          requestSlackToken(options, code);
        } else if (error) {
          alert('Oops! Something went wrong and we couldn\'t' + 'log you in using Slack. Please try again.');
        }
      }

      function requestSlackToken(options, code) {
        const uri = `${options.host}?client_id=${options.client_id}&client_secret=${options.client_secret}&code=${code}`;
        return fetch(uri).then((resp) => {
          resp.json().then((data) => {
            if(data.access_token === undefined) {
              alert('Error trying to login');
              return;
            }
            localStorage.setItem('token', data.access_token);
            localStorage.setItem('user', JSON.stringify(data.user));
            localStorage.setItem('team', JSON.stringify(data.team));
            redirect();
          }).catch((err) => {
            console.log(err);
          });
        });
      }

      function redirect() {
        _this.transitionToRoute('dashboard');
      }

    }
  }
});
