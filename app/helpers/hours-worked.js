import Ember from 'ember';
import moment from 'moment';

export function hoursWorked(params) {
  const [logs] = params;
  const len = logs.get('length');
  if (len > 0) {

    let millisecs = 0;

    for (let i = 0; i < len - 1; i++) {
      const startDate = moment(logs[i].get('dateTime')).format('MMM Do YYYY');
      for (let j = i + 1; j < len; j++) {
        const endDate = moment(logs[j].get('dateTime')).format('MMM Do YYYY');
        if (startDate !== endDate || j === len - 1) {
          const startDateTime = logs[i].get('dateTime');
          const endDateTime = logs[j - 1].get('dateTime');
          const dateTimeDiff = moment(endDateTime).diff(startDateTime);
          const duration = moment.duration(dateTimeDiff);
          millisecs += duration.asHours();
          i = j;
          break;
        }
      }
    }
    return millisecs.toFixed(2);
  } else {
    return 0;
  }
}

export default Ember.Helper.helper(hoursWorked);
