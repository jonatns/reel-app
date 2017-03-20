/* jshint node: true */

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'reel-app',
    environment: environment,
    rootURL: null,
    locationType: 'hash',
    EmberENV: {
      FEATURES: {

      }
    },

    APP: {

    },
    slack: {
      accessUri: 'https://slack.com/api/oauth.access',
      clientId: '143373541587.144219915428',
      clientSecret: '27e616cc2a9d15633620326fae8de135',
      scopes: ['users.profile:read', 'team:read', 'users:read']
    },
    firebase: {
      apiKey: 'AIzaSyB_iCXQjOWC8BZtMbYO1LBgVlb1lC16TKg',
      authDomain: 'reel-app.firebaseapp.com',
      databaseURL: 'https://reel-app.firebaseio.com',
      storageBucket: 'reel-app.appspot.com',
      messagingSenderId: '604040087927'
    }
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...

    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
  }

  if (environment === 'production') {
  }

  return ENV;
};
