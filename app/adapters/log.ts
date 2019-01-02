import OsfAdapter from './osf-adapter';

export default class LogAdapter extends OsfAdapter {
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        log: LogAdapter;
    } // eslint-disable-line semi
}
