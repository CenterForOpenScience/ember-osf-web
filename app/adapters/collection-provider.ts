import config from 'ember-get-config';
import OsfAdapter from './osf-adapter';

const [apiMajorVersion, apiMinorVersion] = config.OSF.apiVersion.split('.');
const lessThan28 = +apiMajorVersion <= 2 && +apiMinorVersion < 8;

export default class CollectionProvider extends OsfAdapter.extend({
    pathForType(type: string): string {
        return lessThan28 ? this._super(type) : 'providers/collections';
    },
}) {}

declare module 'ember-data' {
    interface AdapterRegistry {
        'collection-provider': CollectionProvider;
    }
}
