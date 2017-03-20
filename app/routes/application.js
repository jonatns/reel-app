import Ember from 'ember';

/* global require */
const { remote } = require('electron');
const BrowserWindow = remote.BrowserWindow;
const currentWindow = BrowserWindow.fromId(1);

export default Ember.Route.extend({
  dataService: Ember.inject.service(),
  watcher: Ember.inject.service(),
  beforeModel() {
    const dataService = this.get('dataService');
    const watcher = this.get('watcher');
    const token = dataService.getToken();
    const project = dataService.project;

    currentWindow.on('close', () => {
      dataService.setDisconnected();
    });

    if (token) {
      dataService.setUser();
      if (project) {
        dataService.setConnected();
        watcher.setWatcher();
        this.transitionTo('dashboard.me');
      } else {
        this.transitionTo('selection');
      }
    } else {
      this.transitionTo('login');
    }
  }
});
