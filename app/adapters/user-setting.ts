import OsfAdapter from './osf-adapter';

export default class UserSettingAdapter extends OsfAdapter {
    parentRelationship = 'user';
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        'user-setting': UserSettingAdapter;
    } // eslint-disable-line semi
}
