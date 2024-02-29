import { Factory } from 'ember-cli-mirage';
import faker from 'faker';

import AuthorizedCitationServiceAccount from 'ember-osf-web/models/authorized-citation-service-account';

export default Factory.extend<AuthorizedCitationServiceAccount>({
    externalUserId: faker.random.uuid(),
    externalUserDisplayName: faker.name.findName(),
    scopes: [],
});

declare module 'ember-cli-mirage/types/registries/model' {
    export default interface MirageModelRegistry {
        'authorized-citation-service-account': AuthorizedCitationServiceAccount;
    } // eslint-disable-line semi
}

declare module 'ember-cli-mirage/types/registries/schema' {
    export default interface MirageSchemaRegistry {
        authorizedCitationServiceAccount: AuthorizedCitationServiceAccount;
    } // eslint-disable-line semi
}
