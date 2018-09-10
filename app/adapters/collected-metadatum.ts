import DS from 'ember-data';
import OsfAdapter from 'ember-osf-web/adapters/osf-adapter';
import $ from 'jquery';

export default class CollectedMetadatum extends OsfAdapter.extend({
    /**
     * Stub for typing
     */
    urlPrefix(...args: any[]): string {
        return this._super(...args);
    },

    urlForCreateRecord(_: 'collected-metadatum', { record }: DS.Snapshot): string {
        return `${this.urlPrefix()}/collections/${record.get('collection.id')}/collected_metadata/`;
    },

    urlForQuery(this: CollectedMetadatum): string {
        return `${this.urlPrefix()}/search/collections/`;
    },

    query(_: DS.Store, type: any, query: any): Promise<any> {
        const url = this.buildURL(type.modelName, null, null, 'query', query);
        const { page, ...restQuery } = query;

        let queryParams = '';

        if (page) {
            queryParams += `?${$.param({ page })}`;
        }

        return this.ajax(`${url}${queryParams}`, 'POST', {
            data: {
                data: {
                    attributes: this.sortQueryParams ? this.sortQueryParams(restQuery) : restQuery,
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
