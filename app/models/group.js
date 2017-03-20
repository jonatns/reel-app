import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  team: DS.belongsTo('team', { async: true, inverse: null }),
  users: DS.hasMany('user', { async: true, inverse: null })
});
