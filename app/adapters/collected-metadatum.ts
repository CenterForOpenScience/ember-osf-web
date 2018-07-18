import DS from 'ember-data';
import OsfAdapter from 'ember-osf-web/adapters/osf-adapter';

export default class CollectedMetadatum extends OsfAdapter.extend({
    pathForType(): string {
        return 'search/collections';
    },

    query(_: DS.Store, type: any, query: any): Promise<any> {
        const url = this.buildURL(type.modelName, null, null, 'query', query);

        return this.ajax(url, 'POST', {
            data: {
                data: {
                    attributes: this.sortQueryParams ? this.sortQueryParams(query) : query,
                },
                type: 'search',
            },
        });
    },
}) {
}

declare module 'ember-data' {
    interface AdapterRegistry {
        'collected-metadatum': CollectedMetadatum;
    }
}
