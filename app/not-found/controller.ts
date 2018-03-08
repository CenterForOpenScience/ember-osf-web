import Controller from '@ember/controller';
import config from 'ember-get-config';

export default class NotFound extends Controller.extend({
}) {
    supportEmail: string = config.support.supportEmail;
}

declare module '@ember/controller' {
  interface Registry {
    'not-found': NotFound;
  }
}
