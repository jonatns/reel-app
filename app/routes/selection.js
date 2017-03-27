import Ember from 'ember';

export default Ember.Route.extend({
  dataService: Ember.inject.service(),
  beforeModel() {
    const dataService = this.get('dataService');

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
  },
  model() {
    const dataService = this.get('dataService');
    return Ember.RSVP.hash({
      groups: dataService.getGroups()
    });
  }
});
