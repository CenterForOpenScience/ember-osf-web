import { ModelInstance } from 'ember-cli-mirage';

import { addonServiceAPIUrl } from 'ember-osf-web/adapters/addon-service';
import AuthorizedComputingAccount from 'ember-osf-web/models/authorized-computing-account';

import ApplicationSerializer from './application';

interface MirageAuthorizedComputingAccount extends ModelInstance<AuthorizedComputingAccount> {
    configuringUserId: string;
    externalComputingServiceId: string;
}

export default class AuthorizedComputingAccountSerializer extends ApplicationSerializer<AuthorizedComputingAccount> {
    buildRelationships(model: MirageAuthorizedComputingAccount) {
        return {
            configuringUser: {
                links: {
                    related: {
                        href: `${addonServiceAPIUrl}user-references/${model.configuringUserId}/`,
                    },
                },
            },
            couldComputingService: {
                links: {
                    related: {
                        href: `${addonServiceAPIUrl}external-computing-services/${model.externalComputingServiceId}/`,
                    },
                },
            },
        };
    }
}
