import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('dashboard', function() {
    this.route('settings');
    this.route('profile');
    this.route('users');
    this.route('loading');
    this.route('me');
  });
  this.route('login');
  this.route('selection');
});

export default Router;
