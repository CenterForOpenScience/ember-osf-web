import { Factory } from 'ember-cli-mirage';
import faker from 'faker';

import AuthorizedComputingAccountModel from 'ember-osf-web/models/authorized-computing-account';

export default Factory.extend<AuthorizedComputingAccountModel>({
    externalUserId: faker.random.uuid(),
    externalUserDisplayName: faker.name.findName(),
    scopes: [],
});

declare module 'ember-cli-mirage/types/registries/model' {
    export default interface MirageModelRegistry {
        'authorized-computing-account': AuthorizedComputingAccountModel;
    } // eslint-disable-line semi
}

declare module 'ember-cli-mirage/types/registries/schema' {
    export default interface MirageSchemaRegistry {
        authorizedComputingAccount: AuthorizedComputingAccountModel;
    } // eslint-disable-line semi
}
