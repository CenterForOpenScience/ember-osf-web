import OsfAdapter from './osf-adapter';

export default class UserSettingAdapter extends OsfAdapter {
    parentRelationship = 'user';
}

declare module 'ember-data' {
    interface AdapterRegistry {
        'user-setting': UserSettingAdapter;
    }
}
