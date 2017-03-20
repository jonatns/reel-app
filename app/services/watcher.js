import Ember from 'ember';

/* global require */
const chokidar = require('chokidar');
let watcher = null;
let lastPathChanged;

export default Ember.Service.extend({
  dataService: Ember.inject.service(),
  setWatcher() {
    const dataService = this.get('dataService');
    const project = JSON.parse(localStorage.getItem('project'));
    const path = project.path;
    const name = project.name;
    watcher = chokidar.watch(path, {
      ignored: /(^|[\\])\../,
      persistent: true
    });
    watcher.on('change', (absolutePath) => {
      const changedPath = absolutePath.substring(absolutePath.indexOf(name));
      if (lastPathChanged !== changedPath) {
        lastPathChanged = changedPath;
        dataService.addLog('started editing ' + changedPath);
      }
    });
  },
  closeWatcher() {
    console.log('ended');
    lastPathChanged = '';
    watcher.close();
  }
});
