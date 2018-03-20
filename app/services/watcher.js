import Ember from 'ember';

/* global require */
const chokidar = require('chokidar');
let watcher = null;
let lastPathChanged;

export default Ember.Service.extend({
  dataService: Ember.inject.service(),
  repo: Ember.inject.service(),
  store: Ember.inject.service(),
  setWatcher() {
    const project = JSON.parse(localStorage.getItem('project'));
    const path = project.path;
    /* global require */
    const simpleGit = require('simple-git')(path);
    const dataService = this.get('dataService');
    const name = project.name;
    watcher = chokidar.watch(path, {
      ignored: /(^|[\\])\../,
      persistent: true
    });
    watcher.on('change', (absolutePath) => {
      const changedPath = absolutePath.substring(absolutePath.indexOf(name));
      if (changedPath.includes('/.git/HEAD')) {
        this.get('repo').setup();
      }
      if (lastPathChanged !== changedPath) {
        lastPathChanged = changedPath;
        if (!changedPath.includes('.git')) {
          dataService.addLog('started editing ' + changedPath);
        }
      }
    });
  },
  closeWatcher() {
    console.log('ended');
    lastPathChanged = '';
    watcher.close();
  }
});
