import { ModelInstance } from 'ember-cli-mirage';
import config from 'ember-get-config';
import CollectionSubmissionAction from 'ember-osf-web/models/collection-submission-action';
import ApplicationSerializer, { SerializedRelationships } from './application';

const { OSF: { apiUrl } } = config;

export default class ReviewActionSerializer extends ApplicationSerializer<CollectionSubmissionAction> {
    buildRelationships(model: ModelInstance<CollectionSubmissionAction>) {
        const relationships: SerializedRelationships<CollectionSubmissionAction> = {
            target: {
                links: {
                    related: {
                        href: `${apiUrl}/v2/collection_submissions/${model.target.id}`,
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
