import { service } from '@ember-decorators/service';
import Controller from '@ember/controller';
import config from 'ember-get-config';

export default class Support extends Controller {
    @service analytics;

    helpUrl: string = config.OSF.helpUrl;

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
