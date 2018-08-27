import { RelationshipsFor } from 'ember-data';
import config from 'ember-get-config';
import { RelationshipLinks } from 'osf-api';

import DraftRegistration from 'ember-osf-web/models/draft-registration';

// @ts-ignore
import ApplicationSerializer from './application';

const { OSF: { apiUrl } } = config;

type SerializedDraftRegistrationLinks = {
    [relName in Exclude<RelationshipsFor<DraftRegistration>, 'toString'>]?: RelationshipLinks;
};

export default class DraftRegistrationSerializer extends ApplicationSerializer {
    links(model: any): SerializedDraftRegistrationLinks {
        return {
            branchedFrom: {
                related: {
                    href: `${apiUrl}/v2/nodes/${model.branchedFrom.id}`,
                    meta: {},
                },
            },
            initiator: {
                related: {
                    href: `${apiUrl}/v2/users/${model.initiator.id}`,
                    meta: {},
                },
            },
            registrationSchema: {
                related: {
                    href: `${apiUrl}/v2/schemas/registrations/${model.registrationSchema.id}`,
                    meta: {},
                },
            },
        };
    }
}
