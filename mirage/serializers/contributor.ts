import { ModelInstance } from 'ember-cli-mirage';
import config from 'ember-get-config';

import Contributor from 'ember-osf-web/models/contributor';

import ApplicationSerializer, { SerializedRelationships } from './application';

const { OSF: { apiUrl } } = config;

export default class ContributorSerializer extends ApplicationSerializer<Contributor> {
    buildNormalLinks(model: ModelInstance<Contributor>) {
        const url = model.node ?
            `${apiUrl}/v2/nodes/${model.node.id}/contributors/${model.id}` :
            `${apiUrl}/v2/draft_registrations/${model.draftRegistration.id}/contributors/${model.id}`;
        return {
            self: url,
        };
    }

    buildRelationships(model: ModelInstance<Contributor>) {
        const relationships: SerializedRelationships<Contributor> = {
            users: {
                links: {
                    related: {
                        href: `${apiUrl}/v2/users/${model.users.id}/`,
                        meta: this.buildRelatedLinkMeta(model, 'users'),
                    },
                },
            },
        };
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
        return relationships;
    }
}
