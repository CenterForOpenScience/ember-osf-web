import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import config from 'ember-get-config';
import Analytics from 'ember-osf-web/services/analytics';

export default class Support extends Controller {
    @service analytics!: Analytics;

    helpUrl: string = config.OSF.helpUrl;

    constructor(...args: any[]) {
        super(...args);
        Object.assign(this, config.support);
    }
}

declare module '@ember/controller' {
    interface Registry {
        support: Support;
    }
}
