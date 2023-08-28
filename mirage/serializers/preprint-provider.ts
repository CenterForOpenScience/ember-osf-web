import { ModelInstance } from 'ember-cli-mirage';
import config from 'ember-get-config';
import PreprintProvider from 'ember-osf-web/models/preprint-provider';
import ApplicationSerializer, { SerializedRelationships } from './application';

const { OSF: { apiUrl } } = config;

export default class PreprintProviderSerializer extends ApplicationSerializer<PreprintProvider> {
    buildNormalLinks(model: ModelInstance) {
        return {
            self: `${apiUrl}/v2/providers/preprints/${model.id}/`,
        };
    }

    buildRelationships(model: ModelInstance<PreprintProvider>) {
        const relationships: SerializedRelationships<PreprintProvider> = {
            subjects: {
                links: {
                    related: {
                        href: `${apiUrl}/v2/providers/preprints/${model.id}/subjects/`,
                        meta: this.buildRelatedLinkMeta(model, 'subjects'),
                    },
                },
            },
            highlightedSubjects: {
                links: {
                    related: {
                        href: `${apiUrl}/v2/providers/preprints/${model.id}/highlightedSubjects/`,
                        meta: this.buildRelatedLinkMeta(model, 'highlightedSubjects'),
                    },
                },
            },
            licensesAcceptable: {
                links: {
                    related: {
                        href: `${apiUrl}/v2/providers/preprints/${model.id}/licenses/`,
                        meta: {},
                    },
                },
            },
            moderators: {
                links: {
                    related: {
                        href: `${apiUrl}/v2/providers/preprints/${model.id}/moderators/`,
                        meta: this.buildRelatedLinkMeta(model, 'moderators'),
                    },
                },
            },
            preprints: {
                links: {
                    related: {
                        href: `${apiUrl}/v2/providers/preprints/${model.id}/preprints/`,
                        meta: {},
                    },
                },
            },
            // TODO: subscriptions when we move ember-osf-reviews¥
        };

        if (model.brand) {
            relationships.brand = {
                links: {
                    related: {
                        href: `${apiUrl}/v2/brands/${model.brand.id}/`,
                        meta: {},
                    },
                },
            };
        }

        return relationships;
    }
}
