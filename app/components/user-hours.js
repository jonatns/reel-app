import Ember from 'ember';

export default Ember.Component.extend({
  userLogs: Ember.computed('user.logs.@each', function() {
    const userId = this.get('user.id');
    const logs = this.get('user.logs');
    return logs.filterBy('user.id', userId);
  })
});
