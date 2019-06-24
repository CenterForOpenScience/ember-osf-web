import { ModelInstance } from 'ember-cli-mirage';
import config from 'ember-get-config';

import Subject from 'ember-osf-web/models/subject';

import ApplicationSerializer from './application';

const { OSF: { apiUrl } } = config;

export default class SubjectSerializer extends ApplicationSerializer<Subject> {
    buildRelationships(model: ModelInstance<Subject>) {
        return {
            children: {
                links: {
                    related: {
                        href: `${apiUrl}/v2/subjects/${model.id}/children`,
                        meta: this.buildRelatedLinkMeta(model, 'children'),
                    },
                },
            },
        };
    }
}
