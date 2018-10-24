import config from 'ember-get-config';
import DraftRegistration from 'ember-osf-web/models/draft-registration';
import ApplicationSerializer, { SerializedLinks } from './application';

const { OSF: { apiUrl } } = config;

export default class DraftRegistrationSerializer extends ApplicationSerializer {
    links(model: DraftRegistration): SerializedLinks<DraftRegistration> {
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
