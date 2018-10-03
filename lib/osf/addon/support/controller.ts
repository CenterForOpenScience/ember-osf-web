import { service } from '@ember-decorators/service';
import Controller from '@ember/controller';
import config from 'ember-get-config';
import Analytics from 'ember-osf-web/services/analytics';

export default class Support extends Controller {
    @service analytics!: Analytics;

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
