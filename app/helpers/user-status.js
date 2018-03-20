import Ember from 'ember';

export function userStatus(params) {
  const [user, statuses] = params;
  const userStatus = statuses.findBy('user.id', user.get('id'));
  
  return userStatus;
}

export default Ember.Helper.helper(userStatus);
