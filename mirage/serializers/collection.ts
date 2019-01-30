import { ModelInstance } from 'ember-cli-mirage';
import config from 'ember-get-config';
import Collection from 'ember-osf-web/models/collection';
import ApplicationSerializer from './application';

const { OSF: { apiUrl } } = config;

export default class CollectionSerializer extends ApplicationSerializer<Collection> {
    buildRelationships(model: ModelInstance<Collection>) {
        return {
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
    }
}
