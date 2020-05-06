import { ModelInstance } from 'ember-cli-mirage';
import config from 'ember-get-config';
import Meeting from 'ember-osf-web/models/meeting';
import ApplicationSerializer from './application';

const { OSF: { apiUrl } } = config;

export default class MeetingSerializer extends ApplicationSerializer<Meeting> {
    buildRelationships(model: ModelInstance<Meeting>) {
        return {
            submissions: {
                links: {
                    related: {
                        href: `${apiUrl}/_/meetings/${model.id}/submissions`,
                        meta: this.buildRelatedLinkMeta(model, 'submissions'),
                    },
                },
            },
        };
    }
    buildNormalLinks(model: ModelInstance<Meeting>) {
        return {
            self: `${apiUrl}/_/meetings/${model.id}`,
        };
    }
}
