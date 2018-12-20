import OsfAdapter from './osf-adapter';

export default class UserSettingsAdapter extends OsfAdapter {
    parentRelationship = 'user';
}

declare module 'ember-data' {
    interface AdapterRegistry {
        'user-settings': UserSettingsAdapter;
    }
}
