import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  team: DS.belongsTo('team', { async: true }),
  users: DS.hasMany('user', { async: true }),
  logs: DS.hasMany('log', { async: true }),
  statuses: DS.hasMany('status', { async: true })
});
