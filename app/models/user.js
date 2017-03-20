import DS from 'ember-data';

export default DS.Model.extend({
  email: DS.attr('string'),
  firstname: DS.attr('string'),
  lastname: DS.attr('string'),
  isAdmin: DS.attr('boolean'),
  isOwner: DS.attr('boolean'),
  image: DS.attr('string'),
  isConnected: DS.attr('boolean'),
  team: DS.belongsTo('team', { async: true, inverse: null }),
  group: DS.belongsTo('group', { async: true, inverse: null }),
  logs: DS.hasMany('log', { async: true, inverse: null })
});
