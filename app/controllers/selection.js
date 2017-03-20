import Ember from 'ember';

export default Ember.Controller.extend({
  dataService: Ember.inject.service(),
  watcher: Ember.inject.service(),
  selectedGroup: null,
  projectName: null,
  projectPath: null,
  isSelected: Ember.computed('selectedGroup', function() {
    return !this.get('selectedGroup');
  }),
  'non-mpim-groups': Ember.computed('model.groups', function() {
    const groups = this.get('model.groups');
    return groups.filterBy('is_mpim', false);
  }),
  isComplete: Ember.computed('selectedGroup', 'projectName', 'projectPath', function() {
    const selectedGroup = this.get('selectedGroup');
    const projectName = this.get('projectName');
    const projectPath = this.get('projectPath');
    if (selectedGroup && projectName && projectPath) {
      return true;
    } else {
      return false;
    }
  }),
  actions: {
    setSelectedProject() {
      const files = Ember.$('#selectedProject').prop('files');
      const projectName = files[0].name;
      const projectPath = files[0].path;
      this.set('projectPath', projectPath);
      this.set('projectName', projectName);
    },
    startWatching() {
      const dataService = this.get('dataService');
      const watcher = this.get('watcher');
      const isComplete = this.get('isComplete');
      if (isComplete) {
        const selectedGroup = this.get('selectedGroup');
        const selectedProjectObj = {
          name: this.get('projectName'),
          path: this.get('projectPath')
        };
        const selectedProject = JSON.stringify(selectedProjectObj);
        dataService.setupGroupAndProjectData(selectedGroup, selectedProject)
        .then(() => {
          this.setProperties({
            selectedGroup: null,
            projectName: null,
            projectPath: null
          });
          dataService.setConnected();
          watcher.setWatcher();
          this.transitionToRoute('dashboard.me');
        }).catch((err) => {
          console.log(err);
        });
      }
    },
    logout() {
      const dataService = this.get('dataService');
      dataService.clearUser();
      this.transitionToRoute('login');
    }
  }
});
