import Store from '@ember-data/store';
import { assert } from '@ember/debug';
import RSVP from 'rsvp';

import DS from 'ember-data';

import OsfAdapter from 'ember-osf-web/adapters/osf-adapter';
import param from 'ember-osf-web/utils/param';

export default class CollectionSubmissionAdapter extends OsfAdapter {
    urlForHybridGuid(id: string): string {
        const splitId = id.split('-');

        assert('ID for findRecord should be in the format: collectionId-collectionSubmissionId', splitId.length === 2);

        const [collectionId, collectionSubmissionId] = splitId;

        return `${this.urlPrefix()}/collections/${collectionId}/collection_submissions/${collectionSubmissionId}`;
    }

    urlForCreateRecord(_: string | number, { record }: DS.Snapshot): string {
        const collectionId = record.belongsTo('collection').id();
        return `${this.urlPrefix()}/collections/${collectionId}/collection_submissions/`;
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

    query(_: Store, type: any, query: Record<string, string>): RSVP.Promise<any> {
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
        'collection-submission': CollectionSubmissionAdapter;
    } // eslint-disable-line semi
}
