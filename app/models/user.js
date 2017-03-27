import DS from 'ember-data';

export default DS.Model.extend({
  email: DS.attr('string'),
  firstname: DS.attr('string'),
  lastname: DS.attr('string'),
  isAdmin: DS.attr('boolean'),
  isOwner: DS.attr('boolean'),
  image: DS.attr('string'),
  isConnected: DS.attr('boolean'),
  groups: DS.hasMany('group', { async: true }),
  logs: DS.hasMany('log', { async: true, inverse: null })
});
