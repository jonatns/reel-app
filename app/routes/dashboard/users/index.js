import Ember from 'ember';

export default Ember.Route.extend({
  dataService: Ember.inject.service(),
  model() {
    return this.get('store').query('status', {
      orderBy: 'group',
      equalTo: this.get('dataService').group.get('id')
    });
  }
});
