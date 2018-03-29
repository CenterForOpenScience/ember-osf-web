import { service } from '@ember-decorators/service';
import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { task } from 'ember-concurrency';
import config from 'ember-get-config';
import UserRegistration from 'ember-osf-web/models/user-registration';
import chunkArray from 'ember-osf-web/utils/chunk-array';

export default class Home extends Controller.extend({
    submit: task(function* (this: Home) {
        const model = this.get('model');
        const { validations } = yield model.validate();
        this.set('didValidate', true);

        if (!validations.get('isValid')) {
            return;
        }

        yield model.save();

        this.set('hasSubmitted', true);
    }).drop(),
}) {
    @service analytics;
    didValidate: boolean;
    goodbye = null;
    hasSubmitted = false;
    modalOpen: boolean = this.modalOpen || false;
    model: UserRegistration;
    playerVars = {
        autoplay: 1,
        showinfo: 0,
    };
    queryParams = ['goodbye'];

    integrationsList = [
        'dropbox',
        'github',
        'amazon',
        'box',
        'google',
        'figshare',
        'dataverse',
        'mendeley',
    ];

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

    integrations = computed('integrationsList', function (): string[][] {
        return chunkArray(this.get('integrationsList'), 4);
    });

    features = computed('featuresList', function (): string[][] {
        const featuresList = this.get('featuresList');

        return chunkArray(featuresList, Math.ceil(featuresList.length / 2));
    });

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
