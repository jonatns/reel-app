import Ember from 'ember';

export default Ember.Component.extend({
  dataService: Ember.inject.service(),
  usersExceptMe: Ember.computed(function() {
    const dataService = this.get('dataService');
    const users = dataService.group.get('users');
    const me = dataService.user;
    return users.filter((user) => user.id !== me.get('id'));
  })
});
