import { Factory } from 'ember-cli-mirage';
import faker from 'faker';

import AuthorizedCitationAccount from 'ember-osf-web/models/authorized-citation-account';

export default Factory.extend<AuthorizedCitationAccount>({
    externalUserId: faker.random.uuid(),
    externalUserDisplayName: faker.name.findName(),
    scopes: [],
});

declare module 'ember-cli-mirage/types/registries/model' {
    export default interface MirageModelRegistry {
        'authorized-citation-account': AuthorizedCitationAccount;
    } // eslint-disable-line semi
}

declare module 'ember-cli-mirage/types/registries/schema' {
    export default interface MirageSchemaRegistry {
        authorizedCitationAccount: AuthorizedCitationAccount;
    } // eslint-disable-line semi
}
