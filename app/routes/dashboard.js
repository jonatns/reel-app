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
        dataService.loadUserStatus().then(() => {
          dataService.setConnected();
          this.transitionTo('dashboard.me');
        });
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
  },
  actions: {
    branchChanged(branch) {
      const user = this.get('dataService').user;
      user.set('currentBranch', branch);
      user.save();
    }
  }
});
