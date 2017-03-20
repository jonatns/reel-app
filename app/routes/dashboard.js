import Ember from 'ember';

export default Ember.Route.extend({
  dataService: Ember.inject.service(),
  model() {
    const dataService = this.get('dataService');
    const teamId = dataService.getTeamId();
    const groupId = dataService.getGroupId();
    return Ember.RSVP.hash({
      group: this.get('store').findRecord('group', groupId),
      team: this.get('store').findRecord('team', teamId)
    });
  }
});
