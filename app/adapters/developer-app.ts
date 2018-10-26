import OsfAdapter from './osf-adapter';

export default class DeveloperAppAdapter extends OsfAdapter {
    pathForType(_: string) {
        return 'applications';
    }
}

declare module 'ember-data' {
    interface AdapterRegistry {
        'developer-app': DeveloperAppAdapter;
    }
}
