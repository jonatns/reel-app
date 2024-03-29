import Ember from 'ember';

const { $ } = Ember;

export default Ember.Component.extend({
  dataService: Ember.inject.service(),
  watcher: Ember.inject.service(),
  isOnline: true,
  branch: null,
  didInsertElement() {
    this._super(...arguments);
    const _this = this;
    const dataService = this.get('dataService');
    $(window).on('online', function() {
      dataService.setConnected();
      _this.set('isOnline', true);
    });
    $(window).on('offline', function() {
      dataService.setDisconnected();
      _this.set('isOnline', false);
    });
  },
  userNew(data) {
    const email = data.email;
    const members = this.get('model.members');
    const member = members.filter((m) => {
      console.log(m);
      return m.email === email;
    });
    console.log(member);
  },
  actions: {
    logout() {
      this.sendAction('logout');
    }
  }
});
