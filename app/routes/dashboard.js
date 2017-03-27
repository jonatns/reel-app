import Ember from 'ember';

export default Ember.Route.extend({
  dataService: Ember.inject.service(),
  watcher: Ember.inject.service(),
  beforeModel() {
    const watcher = this.get('watcher');
    watcher.setWatcher();
  }
});
