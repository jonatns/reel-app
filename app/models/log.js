import DS from 'ember-data';

export default DS.Model.extend({
  description: DS.attr('string'),
  dateTime: DS.attr('date', {
    defaultValue() { return new Date(); }
  }),
  user: DS.belongsTo('user', { async: true, inverse: null }),
  project: DS.belongsTo('project', { async: true, inverse: null })
});
