import OsfAdapter from './osf-adapter';

export default class Log extends OsfAdapter {}

declare module 'ember-data' {
    interface AdapterRegistry {
        'log': Log;
    }
}
