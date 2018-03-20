import Ember from 'ember';
import fetch from 'fetch';

export default Ember.Service.extend({
  store: Ember.inject.service('store'),
  ajax: Ember.inject.service(),
  repo: Ember.inject.service(),
  user: null,
  group: null,
  project: null,
  team: null,
  status: null,
  init() {
    this._super(...arguments);
    const projectString = localStorage.getItem('project');
    const project = JSON.parse(projectString);
    this.set('project', project);
  },
  getToken() {
    return localStorage.getItem('token');
  },
  setUserId(id) {
    localStorage.setItem('userId', id);
  },
  setTeamId(id) {
    localStorage.setItem('teamId', id);
  },
  setGroupId(id) {
    localStorage.setItem('groupId', id);
  },
  getUserId() {
    return localStorage.getItem('userId');
  },
  getTeamId() {
    return localStorage.getItem('teamId');
  },
  getGroupId() {
    return localStorage.getItem('groupId');
  },
  loadCurrentUser() {
    return new Ember.RSVP.Promise((resolve, reject) => {
      const userId = localStorage.getItem('userId');
      if (userId) {
        this.get('store').findRecord('user', userId).then((user) => {
          this.set('user', user);
          resolve();
        }).catch((err) => {
          reject(err);
        });
      } else {
        resolve();
      }
    });
  },
  loadCurrentTeam() {
    return new Ember.RSVP.Promise((resolve, reject) => {
      const teamId = localStorage.getItem('teamId');
      if (teamId) {
        this.get('store').findRecord('team', teamId).then((team) => {
          this.set('team', team);
          resolve();
        }).catch((err) => {
          reject(err);
        });
      } else {
        resolve();
      }
    });
  },
  loadCurrentGroup() {
    return new Ember.RSVP.Promise((resolve, reject) => {
      const groupId = localStorage.getItem('groupId');
      if (groupId) {
        this.get('store').findRecord('group', groupId).then((group) => {
          this.set('group', group);
          resolve();
        }).catch((err) => {
          reject(err);
        });
      } else {
        resolve();
      }
    });
  },
  loadUserStatus() {
    return new Ember.RSVP.Promise((resolve) => {
      const group = this.get('group');

      this.get('store').query('status', {
        orderBy: 'user',
        equalTo: this.get('user.id')
      }).then((resp) => {
        const content = resp.get('content');
        if (content.length === 0) {
          const status = this.get('store').createRecord('status', {
            group: group,
            user: this.get('user'),
            isConnected: false,
            currentBranch: 'No remote branch'
          });
          this.get('user.statuses').pushObject(status);
          status.save().then(() => {
            this.get('user').save().then(() => {
              group.get('statuses').pushObject(status);
              group.save().then(() => {
                this.set('status', status);
                this.get('repo').setup();
              });
            });
          });
        } else {
          const status = content[0];
          this.get('store').findRecord('status', status.id).then((status) => {
            this.set('status', status);
            this.get('repo').setup();
            resolve();
          });
        }
      });
    });
  },
  setTeam() {
    const teamId = localStorage.getItem('teamId');
    this.get('store').findRecord('team', teamId).then((team) => {
      this.set('team', team);
    });
  },
  setGroup() {
    const groupId = localStorage.getItem('groupId');
    if (groupId) {
      this.get('store').findRecord('group', groupId).then((group) => {
        this.set('group', group);
      });
    }
  },
  setConnected() {
    const statusId = this.get('status.id');
    this.get('store').findRecord('status', statusId).then((status) => {
      status.set('isConnected', true);
      status.save();
    });
  },
  setDisconnected() {
    const statusId = this.get('status.id');
    this.get('store').findRecord('status', statusId).then((status) => {
      status.set('isConnected', false);
      status.save();
    });
  },
  addLog(description) {
    const user = this.get('user');
    const group = this.get('group');
    const log = this.get('store').createRecord('log', {
      description: `${description}`
    });
    group.get('logs').pushObject(log);
    user.get('logs').pushObject(log);
    log.save().then(() => {
      user.save();
      group.save();
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

    const teamPromise = new Ember.RSVP.Promise((resolve, reject) => {
      fetch(teamUri).then((slackTeamResp) => {
        return slackTeamResp.json();
      }).then((teamData) => {
        _this.findOrCreateTeam(teamData).then(() => {
          return _this.loadCurrentTeam().then(() => {
            resolve();
          });
        }).catch((err) => {
          reject(err);
        });
      });
    });

    const userPromise = new Ember.RSVP.Promise((resolve, reject) => {
      fetch(userUri).then((slackUserResp) => {
        return slackUserResp.json();
      }).then((userData) => {
        _this.findOrCreateUser(userData).then(() => {
          return _this.loadCurrentUser().then(() => {
            resolve();
          });
        }).catch((err) => {
          reject(err);
        });
      });
    });

    return Ember.RSVP.Promise.all([teamPromise, userPromise]);
  },
  findOrCreateTeam(data) {
    const _this = this;
    const teamData = data.team;
    return new Ember.RSVP.Promise((resolve, reject) => {
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
    return new Ember.RSVP.Promise((resolve, reject) => {
      this.get('store').query('user', {
        email: userProfile.email
      }).then((resp) => {
        const content = resp.get('content');
        if (typeof content.findBy('id', userData.id) === 'undefined') {
          const newUser = _this.get('store').createRecord('user', {
            id: userData.id,
            email: userProfile.email,
            firstname: userProfile.first_name,
            lastname: userProfile.last_name,
            isAdmin: userData.is_admin,
            isOwner: userData.is_owner,
            image: userProfile.image_192
          });
          newUser.save().then(() => {
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
            user.save().then(() => {
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
    const user = this.get('user');
    const team = this.get('team');
    const _this = this;
    return new Ember.RSVP.Promise((resolve, reject) => {
      this.get('store').query('group', {
        id: selectedGroup.id
      }).then((resp) => {
        const content = resp.get('content');
        if (typeof content.findBy('id', selectedGroup.id) === 'undefined') {
          const newGroup = _this.get('store').createRecord('group', {
            id: selectedGroup.id,
            name: selectedGroup.name
          });
          team.get('groups').pushObject(newGroup);
          user.get('groups').pushObject(newGroup);
          newGroup.save().then(() => {
            team.save();
            user.save();
            resolve();
          }).catch((err) => {
            reject(err);
          });
        } else {
          _this.get('store').findRecord('group', selectedGroup.id)
          .then((group) => {
            team.get('groups').pushObject(group);
            user.get('groups').pushObject(group);
            group.save().then(() => {
              team.save();
              user.save();
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
    const _this = this;
    const clearGroup = new Ember.RSVP.Promise(function(resolve) {
      _this.set('group', null);
      resolve(localStorage.removeItem('groupId'));
    });
    const clearProject = new Ember.RSVP.Promise(function(resolve) {
      _this.set('project', null);
      resolve(localStorage.removeItem('project'));
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
      this.set('user', null);
      this.set('status', null);
    });
  }
});
