import { ModelInstance } from 'ember-cli-mirage';
import config from 'ember-get-config';
import Institution from 'ember-osf-web/models/institution';

import ApplicationSerializer from './application';

const { OSF: { apiUrl } } = config;

export default class InstitutionSerializer extends ApplicationSerializer<Institution> {
    buildRelationships(model: ModelInstance<Institution>) {
        return {
            userMetrics: {
                links: {
                    related: {
                        href: `${apiUrl}/v2/institutions/${model.id}/users`,
                        meta: this.buildRelatedLinkMeta(model, 'userMetrics'),
                    },
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
