import Ember from 'ember';
import moment from 'moment';

export function hoursWorked(params) {
  const [logs] = params;
  const len = logs.get('length');
  if (len > 0) {
    const min = logs.get('firstObject').get('dateTime');
    const max = logs.get('lastObject').get('dateTime');
    const duration = moment.duration(moment(max).diff(min));
    return duration.asHours().toFixed(2);
  } else {
    return 0;
  }
}

export default Ember.Helper.helper(hoursWorked);
