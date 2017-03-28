import Ember from 'ember';

export default Ember.Route.extend({
  dataService: Ember.inject.service(),
  watcher: Ember.inject.service(),
  beforeModel() {
    const dataService = this.get('dataService');
    const watcher = this.get('watcher');
    watcher.setWatcher();
    return dataService.loadCurrentGroup().then(() => {
      const project = dataService.project;
      const groupId = dataService.getGroupId();
      if (project && groupId) {
        this.transitionTo('dashboard.me');
      } else {
        dataService.clearGroupAndProject().then(() => {
          this.transitionTo('selection');
        });
      }
    }).catch(() => {
      dataService.clearGroupAndProject().then(() => {
        this.transitionTo('selection');
      });
    });
  }
});
