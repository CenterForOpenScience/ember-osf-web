import Controller from '@ember/controller';
import { computed } from '@ember/object';
import Analytics from 'ember-osf-web/mixins/analytics';

function chunk(arr: any[], limit: number): any[][] {
    const original = arr.slice();
    const result = [];

    while (original.length) {
        result.push(original.splice(0, limit));
    }

    return result;
}

export default class Home extends Controller.extend(Analytics) {
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
        return chunk(this.get('integrationsList'), 4);
    });

    features = computed('featuresList', function (): string[][] {
        const featuresList = this.get('featuresList');

        return chunk(featuresList, Math.ceil(featuresList.length / 2));
    });
}

declare module '@ember/controller' {
    interface Registry {
        home: Home;
    }
}
