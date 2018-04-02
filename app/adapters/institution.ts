import OsfAdapter from './osf-adapter';

export default class Institution extends OsfAdapter {}

declare module 'ember-data' {
    interface AdapterRegistry {
        'institution': Institution;
    }
}
