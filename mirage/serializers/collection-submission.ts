import { ModelInstance } from 'ember-cli-mirage';
import config from 'ember-osf-web/config/environment';
import CollectionSubmission from 'ember-osf-web/models/collection-submission';
import ApplicationSerializer from './application';

const { OSF: { apiUrl } } = config;

export default class CollectionSubmissionSerializer extends ApplicationSerializer<CollectionSubmission> {
    buildNormalLinks(model: ModelInstance) {
        return {
            self: `${apiUrl}/v2/collection_submissions/${model.id}/`,
        };
    }
    buildRelationships(model: ModelInstance<CollectionSubmission>) {
        return {
            collection: {
                data: {
                    id: model.collection.id,
                    type: 'collections',
                },
                links: {
                    related: {
                        href: `${apiUrl}/v2/collections/${model.collection.id}/`,
                    },
                },
            },
            guid: {
                data: {
                    id: model.guid.id,
                    type: 'nodes',
                },
                links: {
                    related: {
                        href: `${apiUrl}/v2/nodes/${model.guid.id}/`,
                    },
                },
            },
            creator: {
                data: {
                    id: model.creator.id,
                    type: 'users',
                },
                links: {
                    related: {
                        href: `${apiUrl}/v2/users/${model.creator.id}/`,
                    },
                },
            },
            collectionSubmissionActions: {
                links: {
                    related: {
                        href: `${apiUrl}/v2/collection_submissions/${model.id}/actions/`,
                        meta: this.buildRelatedLinkMeta(model, 'collectionSubmissionActions'),
                    },
                },
            },
        };
    }
}
