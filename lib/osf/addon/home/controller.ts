import { computed } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Controller from '@ember/controller';
import config from 'ember-get-config';
import UserRegistration from 'ember-osf-web/models/user-registration';
import Analytics from 'ember-osf-web/services/analytics';
import chunkArray from 'ember-osf-web/utils/chunk-array';

export default class Home extends Controller {
    @service analytics!: Analytics;

    goodbye = null;
    modalOpen: boolean = this.modalOpen || false;
    model!: UserRegistration;
    playerVars = {
        autoplay: 1,
        showinfo: 0,
    };
    queryParams = ['goodbye'];

    featuresList = [
        'manage',
        'share',
        'changes',
        'analytics',
        'archive',
        'collaboration',
        'workflow',
        'registration',
    ];

    @computed('featuresList')
    get features(this: Home): string[][] {
        const featuresList = this.get('featuresList');

        return chunkArray(featuresList, Math.ceil(featuresList.length / 2));
    }

    constructor() {
        super();
        Object.assign(this, config.home);
    }
}

declare module '@ember/controller' {
    interface Registry {
        home: Home;
    }
}
