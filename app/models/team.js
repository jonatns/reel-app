import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  image: DS.attr('string'),
  users: DS.hasMany('user', { async: true, inverse: null }),
  groups: DS.hasMany('group', { async: true, inverse: null })
});
