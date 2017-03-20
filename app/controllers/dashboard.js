import Ember from 'ember';

export default Ember.Controller.extend({
  dataService: Ember.inject.service(),
  watcher: Ember.inject.service(),
  'non-mpim-groups': Ember.computed('model.groups', function() {
    const groups = this.get('model.groups');
    return groups.filterBy('is_mpim', false);
  }),
  actions: {
    logout() {
      const dataService = this.get('dataService');
      const watcher = this.get('watcher');
      watcher.closeWatcher();
      dataService.setDisconnected();
      dataService.clearUser();
      this.transitionToRoute('login');
    }
  }
});
