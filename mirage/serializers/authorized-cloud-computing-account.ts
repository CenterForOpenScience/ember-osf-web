import { ModelInstance } from 'ember-cli-mirage';

import { addonServiceAPIUrl } from 'ember-osf-web/adapters/addon-service';
import AuthorizedCloudComputingAccount from 'ember-osf-web/models/authorized-cloud-computing-account';

import AddonServiceSerializer from './addon-service-serializer';

interface MirageAuthorizedCloudComputingAccount extends ModelInstance<AuthorizedCloudComputingAccount> {
    configuringUserId: string;
    cloudComputingServiceId: string;
}

export default class AuthorizedCloudComputingAccountSerializer extends AddonServiceSerializer {
    buildRelationships(model: MirageAuthorizedCloudComputingAccount) {
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
                        href: `${addonServiceAPIUrl}cloud-computing-services/${model.cloudComputingServiceId}/`,
                    },
                },
            },
        };
    }
}
