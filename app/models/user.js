import DS from 'ember-data';

export default DS.Model.extend({
  email: DS.attr('string'),
  firstname: DS.attr('string'),
  lastname: DS.attr('string'),
  isAdmin: DS.attr('boolean'),
  isOwner: DS.attr('boolean'),
  image: DS.attr('string'),
  groups: DS.hasMany('group', { async: true }),
  logs: DS.hasMany('log', { async: true }),
  statuses: DS.hasMany('status', { async: true })
});
