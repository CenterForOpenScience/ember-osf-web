import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { task } from 'ember-concurrency';
import Analytics from 'ember-osf-web/mixins/analytics';
import UserRegistration from 'ember-osf-web/models/user-registration';
import chunkArray from 'ember-osf-web/utils/chunk-array';

export default class Home extends Controller.extend(Analytics, {
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
    hasSubmitted = false;
    model: UserRegistration;
    queryParams = ['goodbye'];
    goodbye = null;
    didValidate: boolean;

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
}

declare module '@ember/controller' {
    interface Registry {
        home: Home;
    }
}
