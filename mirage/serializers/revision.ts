import { ModelInstance } from 'ember-cli-mirage';
import config from 'ember-get-config';
import { MirageRevisionModel } from '../factories/revision';
import ApplicationSerializer from './application';
const { OSF: { apiUrl } } = config;

export default class RevisionSerializer extends ApplicationSerializer<MirageRevisionModel> {
    buildRelationships(model: ModelInstance<MirageRevisionModel>) {
        return {
            registration: {
                links: {
                    related: {
                        href: `${apiUrl}/v2/registrations/${model.registration.id}/`,
                        meta: this.buildRelatedLinkMeta(model, 'registration'),
                    },
                },
            },
            initiatedBy: {
                links: {
                    related: {
                        href: `${apiUrl}/v2/users/${model.initiatedBy.id}`,
                        meta: this.buildRelatedLinkMeta(model, 'initiatedBy'),
                    },
                },
            },
            revisionActions: {
                links: {
                    related: {
                        href: `${apiUrl}/v2/revisions/${model.id}/actions/`,
                    },
                },
            },
        };
    }
}
