import Ember from 'ember';

export default Ember.Component.extend({
  dataService: Ember.inject.service(),
  userLogsByGroup: Ember.computed('user.logs', function() {
    const dataService = this.get('dataService');
    const logs = this.get('user.logs');
    const group = dataService.group;
    return logs.filter((log) => log.get('group.id') === group.get('id'));
  })
});
