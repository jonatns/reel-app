import Ember from 'ember';

/* global require */
const { remote } = require('electron');
const BrowserWindow = remote.BrowserWindow;
const currentWindow = BrowserWindow.fromId(1);

export default Ember.Route.extend({
  dataService: Ember.inject.service(),
  beforeModel() {
    const dataService = this.get('dataService');

    currentWindow.on('close', () => {
      dataService.setDisconnected();
    });

    return dataService.loadCurrentUser().then(() => {
      return dataService.loadCurrentTeam().then(() => {
        const token = dataService.getToken();
        if (token) {
          this.transitionTo('selection');
        } else {
          this.transitionTo('login');
        }
      }).catch(() => {
        dataService.clearUser();
        this.transitionTo('login');
      });
    }).catch(() => {
      dataService.clearUser();
      this.transitionTo('login');
    });
  }
});
