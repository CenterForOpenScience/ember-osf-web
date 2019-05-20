import OsfAdapter from './osf-adapter';

export default class MeetingAdapter extends OsfAdapter {
    namespace = '_';
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        meeting: MeetingAdapter;
    } // eslint-disable-line semi
}
