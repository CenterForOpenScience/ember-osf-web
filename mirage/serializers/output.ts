import { ModelInstance } from 'ember-cli-mirage';
import config from 'ember-get-config';
import OutputModel from 'ember-osf-web/models/output';
import ApplicationSerializer from './application';

const { OSF: { apiUrl } } = config;

export default class OutputSerializer extends ApplicationSerializer<OutputModel> {
    buildRelationships(model: ModelInstance<OutputModel>) {
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
    buildNormalLinks(model: ModelInstance<OutputModel>) {
        return {
            self: `${apiUrl}/outputs/${model.id}`,
        };
    }
}
