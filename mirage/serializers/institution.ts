import { ModelInstance } from 'ember-cli-mirage';
import config from 'ember-get-config';
import Institution from 'ember-osf-web/models/institution';

import ApplicationSerializer from './application';

const { OSF: { apiUrl } } = config;

export default class InstitutionSerializer extends ApplicationSerializer<Institution> {
    buildRelationships(model: ModelInstance<Institution>) {
        return {
            nodes: {
                links: {
                    related: {
                        href: `${apiUrl}/v2/institutions/${model.id}/nodes`,
                        meta: this.buildRelatedLinkMeta(model, 'nodes'),
                    },
                },
            },
            registrations: {
                links: {
                    related: {
                        href: `${apiUrl}/v2/institutions/${model.id}/registrations`,
                        meta: this.buildRelatedLinkMeta(model, 'registrations'),
                    },
                },
            },
            users: {
                links: {
                    related: {
                        href: `${apiUrl}/v2/institutions/${model.id}/users`,
                        meta: this.buildRelatedLinkMeta(model, 'users'),
                    },
                },
            },
            userMetrics: {
                links: {
                    related: {
                        href: `${apiUrl}/v2/institutions/${model.id}/metrics/users`,
                        meta: this.buildRelatedLinkMeta(model, 'userMetrics'),
                    },
                },
            },
            departmentMetrics: {
                links: {
                    related: {
                        href: `${apiUrl}/v2/institutions/${model.id}/metrics/departments`,
                        meta: this.buildRelatedLinkMeta(model, 'departmentMetrics'),
                    },
                },
            },
            summaryMetrics: {
                links: {
                    related: {
                        href: `${apiUrl}/v2/institutions/${model.id}/metrics/summary`,
                        meta: {},
                    },
                },
                data: {
                    id: model.id,
                    type: 'institution-summary-metrics',
                },
            },
        };
    }

    buildNormalLinks(model: ModelInstance<Institution>) {
        const { id } = model;
        return {
            ...super.buildNormalLinks(model),
            csv: `/institutions/${id}/csv`,
            html: `/institutions/${id}/`,
        };
    }
}
