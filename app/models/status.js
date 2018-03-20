import DS from 'ember-data';

export default DS.Model.extend({
  isConnected: DS.attr('boolean'),
  currentBranch: DS.attr('string'),
  user: DS.belongsTo('user', { async: true }),
  group: DS.belongsTo('group', { async: true })
});
