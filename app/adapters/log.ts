import OsfAdapter from './osf-adapter';

export default class Log extends OsfAdapter {
}

// DO NOT DELETE: this is how TypeScript knows how to look up your adapters.
declare module 'ember-data' {
    interface AdapterRegistry {
        'log': Log;
    }
}
