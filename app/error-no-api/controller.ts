import Controller from '@ember/controller';
import config from 'ember-get-config';

export default class NoAPI extends Controller {
    supportEmail: string = config.support.supportEmail;
}

declare module '@ember/controller' {
    interface Registry {
        'error-no-api': NoAPI;
    }
}
