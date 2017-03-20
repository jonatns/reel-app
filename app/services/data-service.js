import Ember from 'ember';
import fetch from 'fetch';

export default Ember.Service.extend({
  store: Ember.inject.service('store'),
  ajax: Ember.inject.service(),
  currentUser: null,
  project: null,
  group: null,
  team: null,
  init() {
    const projectString = localStorage.getItem('project');
    const project = JSON.parse(projectString);
    this.set('project', project);
  },
  getToken() {
    return localStorage.getItem('token');
  },
  setUser() {
    const userId = localStorage.getItem('userId');
    this.get('store').findRecord('user', userId).then((user) => {
      this.set('currentUser', user);
    });
  },
  setUserId(id) {
    localStorage.setItem('userId', id);
  },
  setTeamId(id) {
    localStorage.setItem('teamId', id);
  },
  getTeamId() {
    return localStorage.getItem('teamId');
  },
  setGroupId(id) {
    localStorage.setItem('groupId', id);
  },
  getGroupId() {
    return localStorage.getItem('groupId');
  },
  setConnected() {
    const userId = localStorage.getItem('userId');
    this.get('store').findRecord('user', userId).then((user) => {
      user.set('isConnected', true);
      user.save();
    });
  },
  setDisconnected() {
    const userId = localStorage.getItem('userId');
    this.get('store').findRecord('user', userId).then((user) => {
      user.set('isConnected', false);
      user.save();
    });
  },
  addLog(description) {
    const currentUser = this.get('currentUser');
    const log = this.get('store').createRecord('log', {
      description: `${description}`
    });
    log.set('user', currentUser);
    log.set('project', 'project');
    log.save().then(() => {
      currentUser.get('logs').pushObject(log);
      currentUser.save();
    });
  },
  setupUserAndTeamData(data) {
    const token = data.access_token;
    const userId = data.user_id;
    const teamId = data.team_id;
    const userUri = `https://slack.com/api/users.info?token=${token}&user=${userId}`;
    const teamUri = `https://slack.com/api/team.info?token=${token}`;
    const _this = this;

    this.setTeamId(teamId);
    this.setUserId(userId);

    const teamPromise = new Promise((resolve, reject) => {
      fetch(teamUri).then((slackTeamResp) => {
        return slackTeamResp.json();
      }).then((teamData) => {
        _this.findOrCreateTeam(teamData).then(() => {
          resolve();
        }).catch((err) => {
          reject(err);
        });
      });
    });

    const userPromise = new Promise((resolve, reject) => {
      fetch(userUri).then((slackUserResp) => {
        return slackUserResp.json();
      }).then((userData) => {
        _this.findOrCreateUser(userData).then(() => {
          resolve();
        }).catch((err) => {
          reject(err);
        });
      });
    });

    return Promise.all([teamPromise, userPromise]);
  },
  findOrCreateTeam(data) {
    const _this = this;
    const teamData = data.team;
    return new Promise((resolve, reject) => {
      this.get('store').query('team', {
        id: teamData.id
      }).then((resp) => {
        const content = resp.get('content');
        if (typeof content.findBy('id', teamData.id) === 'undefined') {
          const newTeam = _this.get('store').createRecord('team', {
            id: teamData.id,
            name: teamData.name,
            image: teamData.icon.image_132
          });
          newTeam.save().then(() => {
            this.set('team', newTeam);
            resolve();
          }).catch((err) => {
            reject(err);
          });
        } else {
          _this.get('store').findRecord('team', teamData.id)
          .then((team) => {
            team.set('name', teamData.name);
            team.set('image', teamData.icon.image_132);
            team.save().then(() => {
              this.set('team', team);
              resolve();
            }).catch((err) => {
              reject(err);
            });
          });
        }
      }).catch((err) => {
        reject(err);
      });
    });
  },
  findOrCreateUser(data) {
    const _this = this;
    const userData = data.user;
    const userProfile = userData.profile;
    return new Promise((resolve, reject) => {
      this.get('store').query('user', {
        email: userProfile.email
      }).then((resp) => {
        const content = resp.get('content');
        const teamId = this.getTeamId();
        if (typeof content.findBy('id', userData.id) === 'undefined') {
          const newUser = _this.get('store').createRecord('user', {
            id: userData.id,
            email: userProfile.email,
            firstname: userProfile.first_name,
            lastname: userProfile.last_name,
            isAdmin: userData.is_admin,
            isOwner: userData.is_owner,
            image: userProfile.image_192,
            isConnected: false
          });
          const team = _this.get('store').peekRecord('team', teamId);
          newUser.set('team', team);
          newUser.save().then(() => {
            team.get('users').pushObject(newUser);
            team.save();
            this.setUser(userData.id);
            resolve();
          }).catch((err) => {
            reject(err);
          });
        } else {
          _this.get('store').findRecord('user', userData.id).then((user) => {
            user.set('email', userProfile.email);
            user.set('firstname', userProfile.first_name);
            user.set('lastname', userProfile.last_name);
            user.set('isAdmin', userData.is_admin);
            user.set('isOwner', userData.is_owner);
            user.set('image', userProfile.image_192);
            user.set('isConnected', false);
            user.save().then(() => {
              const team = _this.get('store').peekRecord('team', teamId);
              team.get('users').pushObject(user);
              team.save();
              this.setUser(userData.id);
              resolve();
            }).catch((err) => {
              reject(err);
            });
          });
        }
      }).catch((err) => {
        reject(err);
      });
    });
  },
  setupGroupAndProjectData(selectedGroup, selectedProject) {
    this.setProject(selectedProject);
    this.setGroupId(selectedGroup.id);
    return this.findOrCreateGroup(selectedGroup);
  },
  findOrCreateGroup(selectedGroup) {
    const team = this.get('team');
    const currentUser = this.get('currentUser');
    const _this = this;
    return new Promise((resolve, reject) => {
      this.get('store').query('group', {
        id: selectedGroup.id
      }).then((resp) => {
        const content = resp.get('content');
        if (typeof content.findBy('id', selectedGroup.id) === 'undefined') {
          const newGroup = _this.get('store').createRecord('group', {
            id: selectedGroup.id,
            name: selectedGroup.name
          });
          newGroup.set('team', team);
          newGroup.get('users').pushObject(currentUser);
          newGroup.save().then(() => {
            resolve();
          }).catch((err) => {
            reject(err);
          });
        } else {
          _this.get('store').findRecord('group', selectedGroup.id)
          .then((group) => {
            group.set('name', selectedGroup.name);
            group.set('team', team);
            group.get('users').pushObject(currentUser);
            group.save().then(() => {
              resolve();
            }).catch((err) => {
              reject(err);
            });
          });
        }
      });
    });
  },

  getTeam() {
    const token = this.getToken();
    const uri = `https://slack.com/api/team.info?token=${token}`;
    return fetch(uri).then((resp) => {
      return resp.json().then((data) => {
        return data.team;
      });
    });
  },
  getGroups() {
    const token = this.getToken();
    const uri = `https://slack.com/api/groups.list?token=${token}`;
    return fetch(uri).then((response) => {
      return response.json().then((data) => {
        return data.groups;
      });
    });
  },
  setProject(project) {
    this.set('project', project);
    localStorage.setItem('project', project);
  },
  clearGroupAndProject() {
    const clearGroup = new Ember.RSVP.Promise(function(resolve) {
      resolve(localStorage.removeItem('selected-group'));
    });
    const clearProject = new Ember.RSVP.Promise(function(resolve) {
      resolve(localStorage.removeItem('selected-project'));
    });
    return Ember.RSVP.Promise.all([clearGroup, clearProject]);
  },
  clearUser() {
    const token = this.getToken();
    const uri = `https://slack.com/api/auth.revoke?token=${token}`;
    return this.get('ajax').request(uri, {
      method: 'POST'
    }).then(() => {
      localStorage.clear();
    });
  }
});
