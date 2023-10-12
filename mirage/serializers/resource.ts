import { ModelInstance } from 'ember-cli-mirage';
import config from 'ember-osf-web/config/environment';
import ResourceModel from 'ember-osf-web/models/resource';
import ApplicationSerializer from './application';

const { OSF: { apiUrl } } = config;

export default class ResourceSerializer extends ApplicationSerializer<ResourceModel> {
    buildRelationships(model: ModelInstance<ResourceModel>) {
        return {
            registration: {
                links: {
                    related: {
                        href: `${apiUrl}/registrations/${model.registration.id}`,
                        meta: this.buildRelatedLinkMeta(model, 'registration'),
                    },
                },
            },
        };
    }
    buildNormalLinks(model: ModelInstance<ResourceModel>) {
        return {
            self: `${apiUrl}/v2/resources/${model.id}`,
        };
    }
}
