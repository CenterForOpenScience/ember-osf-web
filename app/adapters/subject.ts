import OsfAdapter from './osf-adapter';

export default class SubjectAdapter extends OsfAdapter {
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        'subject': SubjectAdapter;
    } // eslint-disable-line semi
}
