import Ember from 'ember';

export default Ember.Service.extend({
  dataService: Ember.inject.service(),
  currentBranch: null,
  setup() {
    const project = JSON.parse(localStorage.getItem('project'));
    const path = project.path;
    const simpleGit = require('simple-git')(path);

    const status = this.get('dataService').status;

    if (status) {
      simpleGit.branch((err, br) => {
        if (err || br.current === '') {
          status.set('currentBranch', 'No remote branch');
        } else {
          status.set('currentBranch', br.current);
        }
        status.save();
      });
    }
  }
});
