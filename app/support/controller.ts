import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import config from 'ember-get-config';

export default class Support extends Controller {
    helpUrl: string = config.OSF.helpUrl;
    analytics = service('analytics');

    constructor() {
        super();
        Object.assign(this, config.support);
    }
}

declare module '@ember/controller' {
    interface Registry {
        support: Support;
    }
}
