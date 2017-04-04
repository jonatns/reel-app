import Ember from 'ember';

export default Ember.Route.extend({
  dataService: Ember.inject.service(),
  model() {
    const groupId = this.get('dataService').group.get('id');
    return this.get('store').query('log', {
      orderBy: 'group',
      equalTo: groupId
    });
  }
});
