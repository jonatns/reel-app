import Ember from 'ember';

export default Ember.Controller.extend({
  dataService: Ember.inject.service(),
  logs: Ember.computed('model.@each', function() {
    return this.get('model');
  })
});
