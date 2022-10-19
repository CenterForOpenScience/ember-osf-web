import { ModelInstance } from 'ember-cli-mirage';
import config from 'ember-get-config';
import Collection from 'ember-osf-web/models/collection';
import ApplicationSerializer, { SerializedRelationships } from './application';

const { OSF: { apiUrl } } = config;

export default class CollectionSerializer extends ApplicationSerializer<Collection> {
    buildRelationships(model: ModelInstance<Collection>) {
        const returnValue: SerializedRelationships<Collection> = {
            linkedNodes: {
                links: {
                    related: {
                        href: `${apiUrl}/v2/collections/${model.id}/linked_nodes/`,
                    },
                },
            },
            linkedRegistrations: {
                links: {
                    self: {
                        href: `${apiUrl}/v2/collections/${model.id}/relationships/linked_registrations/`,
                        meta: {},
                    },
                    related: {
                        href: `${apiUrl}/v2/collections/${model.id}/linked_registrations/`,
                    },
                },
            },
        };
        if (model.provider) {
            returnValue.provider = {
                links: {
                    related: {
                        href: `${apiUrl}/v2/providers/collections/${model.provider.id}/`,
                    },
                },
            };
        }
        if (model.collectionSubmissions) {
            returnValue.collectionSubmissions = {
                links: {
                    related: {
                        href: `${apiUrl}/v2/collections/${model.id}/collection_submissions/`,
                    },
                },
            };
        }
        return returnValue;
    }
}
