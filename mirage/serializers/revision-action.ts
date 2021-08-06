import { ModelInstance } from 'ember-cli-mirage';
import config from 'ember-get-config';
import RevisionActionModel from 'ember-osf-web/models/revision-action';
import ApplicationSerializer, { SerializedRelationships } from './application';

const { OSF: { apiUrl } } = config;

export default class RevisionActionSerializer extends ApplicationSerializer<RevisionActionModel> {
    buildRelationships(model: ModelInstance<RevisionActionModel>) {
        const relationships: SerializedRelationships<RevisionActionModel> = {
            target: {
                links: {
                    related: {
                        href: `${apiUrl}/v2/revisions/${model.target.id}`,
                        meta: {},
                    },
                },
            },
            creator: {
                links: {
                    related: {
                        href: `${apiUrl}/v2/users/${model.creator.id}`,
                        meta: {},
                    },
                },
            },
        };
        return relationships;
    }
}
