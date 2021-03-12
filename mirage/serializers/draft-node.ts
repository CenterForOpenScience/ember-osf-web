import { ModelInstance } from 'ember-cli-mirage';
import config from 'ember-get-config';
import DraftNodeModel from 'ember-osf-web/models/draft-node';
import ApplicationSerializer, { SerializedRelationships } from './application';

const { OSF: { apiUrl } } = config;

export default class DraftNodeSerializer extends ApplicationSerializer<DraftNodeModel> {
    buildRelationships(model: ModelInstance<DraftNodeModel>): SerializedRelationships<DraftNodeModel> {
        return {
            files: {
                links: {
                    related: {
                        href: `${apiUrl}/v2/draft_nodes/${model.id}/files/`,
                        meta: this.buildRelatedLinkMeta(model, 'files'),
                    },
                },
            },
            draftRegistrations: {
                links: {
                    related: {
                        href: `${apiUrl}/v2/draft_nodes/${model.id}/draft_registrations/`,
                        meta: this.buildRelatedLinkMeta(model, 'draftRegistrations'),
                    },
                },
            },
        };
    }

    buildNormalLinks(model: ModelInstance<DraftNodeModel>) {
        return {
            self: `${apiUrl}/v2/draft_nodes/${model.id}`,
        };
    }
}
