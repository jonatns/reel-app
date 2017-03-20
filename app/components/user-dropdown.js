import Ember from 'ember';

export default Ember.Component.extend({
  dataService: Ember.inject.service(),
  actions: {
    logout() {
      this.sendAction('logout');
    }
  }
});
