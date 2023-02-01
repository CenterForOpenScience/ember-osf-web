import { ModelInstance } from 'ember-cli-mirage';
import config from 'ember-get-config';
import RegistrationSubscription from 'ember-osf-web/models/registration-subscription';
import ApplicationSerializer from './application';

const { OSF: { apiUrl } } = config;

export default class RegistrationSubscriptionSerializer extends ApplicationSerializer<RegistrationSubscription> {
    buildNormalLinks(model: ModelInstance) {
        return {
            self: `${apiUrl}/v2/registration_subscriptions/${model.id}/`,
        };
    }
    buildRelationships(model: ModelInstance<RegistrationSubscription>) {
        return {
            provider: {
                data: {
                    id: model.provider.id,
                    type: 'registration-providers',
                },
                links: {
                    related: {
                        href: `${apiUrl}/v2/providers/registrations/${model.provider.id}/`,
                    },
                },
            },
        };
    }
}
