import { ModelInstance } from 'ember-cli-mirage';
import config from 'ember-get-config';
import CollectedMetadatum from 'ember-osf-web/models/collected-metadatum';
import ApplicationSerializer from './application';

const { OSF: { apiUrl } } = config;

export default class CollectedMetadatumSerializer extends ApplicationSerializer<CollectedMetadatum> {
    buildRelationships(model: ModelInstance<CollectedMetadatum>) {
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
                        href: `${apiUrl}/v2/collected_metadata/${model.id}/actions/`,
                        meta: this.buildRelatedLinkMeta(model, 'collectionSubmissionActions'),
                    },
                },
            },
        };
    }
}
