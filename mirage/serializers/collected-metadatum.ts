import { ModelInstance } from 'ember-cli-mirage';
import config from 'ember-get-config';
import CollectedMetadatum from 'ember-osf-web/models/collected-metadatum';
import ApplicationSerializer from './application';

const { OSF: { apiUrl } } = config;

export default class CollectedMetadatumSerializer extends ApplicationSerializer<CollectedMetadatum> {
    buildRelationships(model: ModelInstance<CollectedMetadatum>) {
        return {
            collection: {
                links: {
                    related: {
                        href: `${apiUrl}/v2/collections/${model.collection.id}/`,
                    },
                },
            },
            guid: {
                links: {
                    related: {
                        href: `${apiUrl}/v2/nodes/${model.id}/`,
                    },
                },
            },
            creator: {
                links: {
                    related: {
                        href: `${apiUrl}/v2/users/${model.id}/`,
                    },
                },
            }
        };
    }
}