import Ember from 'ember';

export default Ember.Controller.extend({
  dataService: Ember.inject.service(),
  watcher: Ember.inject.service(),
  actions: {
    goToSelection() {
      const dataService = this.get('dataService');
      const watcher = this.get('watcher');
      dataService.clearGroupAndProject().then(() => {
        watcher.closeWatcher();
        dataService.setDisconnected();
        this.transitionToRoute('selection');
      });
    }
  }
});
