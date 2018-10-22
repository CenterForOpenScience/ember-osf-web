import OsfAdapter from './osf-adapter';

export default class Log extends OsfAdapter {}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        log: Log;
    } // eslint-disable-line semi
}
