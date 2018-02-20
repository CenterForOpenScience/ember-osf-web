import Controller from '@ember/controller';
import config from 'ember-get-config';
import Analytics from 'ember-osf-web/mixins/analytics';

export default class Support extends Controller.extend(Analytics) {
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
