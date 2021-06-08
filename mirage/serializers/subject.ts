import { ID, ModelInstance } from 'ember-cli-mirage';
import config from 'ember-get-config';

import Subject from 'ember-osf-web/models/subject';

import ApplicationSerializer, { SerializedRelationships } from './application';

const { OSF: { apiUrl } } = config;

export interface SubjectAttrs {
    parentId: ID | null;
    childrenIds: ID[];
}

type MirageSubject = Subject & { attrs: SubjectAttrs };

export default class SubjectSerializer extends ApplicationSerializer<MirageSubject> {
    buildRelationships(model: ModelInstance<MirageSubject>) {
        const relationships: SerializedRelationships<MirageSubject> = {
            children: {
                links: {
                    related: {
                        href: `${apiUrl}/v2/subjects/${model.id}/children`,
                        meta: this.buildRelatedLinkMeta(model, 'children'),
                    },
                },
            },
        };

        if (model.attrs.parentId !== null) {
            const { parentId } = model.attrs;
            relationships.parent = {
                data: {
                    id: parentId as string,
                    type: this.typeKeyForModel(model),
                },
                links: {
                    related: {
                        href: `${apiUrl}/v2/subjects/${parentId}`,
                        meta: {},
                    },
                },
            };
        }

        return relationships;
    }
}
