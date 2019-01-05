import { assert } from '@ember/debug';
import DS from 'ember-data';
import RSVP from 'rsvp';

import OsfAdapter from 'ember-osf-web/adapters/osf-adapter';
import param from 'ember-osf-web/utils/param';

export default class CollectedMetadatumAdapter extends OsfAdapter {
    urlForHybridGuid(id: string): string {
        const splitId = id.split('-');

        assert('ID for findRecord should be in the format: collectionId-collectedMetadatumId', splitId.length === 2);

        const [collectionId, collectedMetadatumId] = splitId;

        return `${this.urlPrefix()}/collections/${collectionId}/collected_metadata/${collectedMetadatumId}`;
    }

    urlForCreateRecord(_: 'collected-metadatum', { record }: DS.Snapshot): string {
        return `${this.urlPrefix()}/collections/${record.get('collection.id')}/collected_metadata/`;
    }

    urlForFindRecord(id: string): string {
        return this.urlForHybridGuid(id);
    }

    urlForUpdateRecord(id: string): string {
        return this.urlForHybridGuid(id);
    }

    urlForQuery(): string {
        return `${this.urlPrefix()}/search/collections/`;
    }

    query(_: DS.Store, type: any, query: Record<string, string>): RSVP.Promise<any> {
        const url = this.buildURL(type.modelName, null, null, 'query', query);
        const { page, sort, ...restQuery } = query;

        const queryParams: Record<string, string> = {};

        if (page) {
            queryParams.page = page;
        }

        if (sort) {
            queryParams.sort = sort;
        }

        return this.ajax([url, param(queryParams)].join('?'), 'POST', {
            data: {
                data: {
                    attributes: restQuery,
                },
                type: 'search',
            },
        });
    }
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        'collected-metadatum': CollectedMetadatumAdapter;
    } // eslint-disable-line semi
}
