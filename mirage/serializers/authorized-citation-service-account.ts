import { ModelInstance } from 'ember-cli-mirage';

import { addonServiceAPIUrl } from 'ember-osf-web/adapters/addon-service';
import AuthorizedCitationServiceAccount from 'ember-osf-web/models/authorized-citation-service-account';

import AddonServiceSerializer from './addon-service-serializer';

interface MirageAuthorizedCitationServiceAccount extends ModelInstance<AuthorizedCitationServiceAccount> {
    configuringUserId: string;
    storageProviderId: string;
}

export default class AuthorizedCitationServiceAccountSerializer extends AddonServiceSerializer {
    buildRelationships(model: MirageAuthorizedCitationServiceAccount) {
        return {
            configuringUser: {
                links: {
                    related: {
                        href: `${addonServiceAPIUrl}user-references/${model.configuringUserId}/`,
                    },
                },
            },
            citationService: {
                links: {
                    related: {
                        href: `${addonServiceAPIUrl}citation-services/${model.storageProviderId}/`,
                    },
                },
            },
        };
    }
}
