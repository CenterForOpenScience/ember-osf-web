import { ID, ModelInstance } from 'ember-cli-mirage';
import config from 'ember-get-config';

import Contributor from 'ember-osf-web/models/contributor';

import ApplicationSerializer, { SerializedRelationships } from './application';

const { OSF: { apiUrl } } = config;

interface ContributorAttrs {
    usersId: ID | null;
}

type MirageContributor = Contributor & { attrs: ContributorAttrs };

export default class ContributorSerializer extends ApplicationSerializer<MirageContributor> {
    buildNormalLinks(model: ModelInstance<MirageContributor>) {
        const url = model.node
            ? `${apiUrl}/v2/nodes/${model.node.id}/contributors/${model.id}`
            : `${apiUrl}/v2/draft_registrations/${model.draftRegistration.id}/contributors/${model.id}`;
        return {
            self: url,
        };
    }

    buildRelationships(model: ModelInstance<MirageContributor>) {
        const relationships: SerializedRelationships<MirageContributor> = {};
        if (model.node !== null) {
            const { node } = model;
            relationships.node = {
                links: {
                    related: {
                        href: `${apiUrl}/v2/nodes/${node.id}`,
                        meta: this.buildRelatedLinkMeta(model, 'node'),
                    },
                },
            };
        }
        if (model.draftRegistration !== null) {
            const { draftRegistration } = model;
            relationships.draftRegistration = {
                links: {
                    related: {
                        href: `${apiUrl}/v2/draft_registrations/${draftRegistration.id}`,
                        meta: this.buildRelatedLinkMeta(model, 'draftRegistration'),
                    },
                },
            };
        }
        if (model.users !== null) {
            const { users } = model;
            relationships.users = {
                links: {
                    related: {
                        href: `${apiUrl}/v2/users/${users.id}/`,
                        meta: this.buildRelatedLinkMeta(model, 'users'),
                    },
                },
            };
        }
        return relationships;
    }
}
