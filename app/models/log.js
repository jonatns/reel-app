import DS from 'ember-data';

export default DS.Model.extend({
  description: DS.attr('string'),
  dateTime: DS.attr('date', {
    defaultValue() { return new Date(); }
  }),
  group: DS.belongsTo('group', { async: true, inverse: null }),
  user: DS.belongsTo('user', { async: true, inverse: null })
});
