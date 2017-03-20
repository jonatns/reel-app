import Ember from 'ember';

export default Ember.Route.extend({
  dataService: Ember.inject.service(),
  model() {
    const dataService = this.get('dataService');
    return Ember.RSVP.hash({
      groups: dataService.getGroups(),
      team: dataService.getTeam()
    });
  }
});
