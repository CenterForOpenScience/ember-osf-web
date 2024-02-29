import { Factory } from 'ember-cli-mirage';
import faker from 'faker';

import AuthorizedCloudComputingAccountModel from 'ember-osf-web/models/authorized-cloud-computing-account';

export default Factory.extend<AuthorizedCloudComputingAccountModel>({
    externalUserId: faker.random.uuid(),
    externalUserDisplayName: faker.name.findName(),
    scopes: [],
});

declare module 'ember-cli-mirage/types/registries/model' {
    export default interface MirageModelRegistry {
        'authorized-cloud-computing-account': AuthorizedCloudComputingAccountModel;
    } // eslint-disable-line semi
}

declare module 'ember-cli-mirage/types/registries/schema' {
    export default interface MirageSchemaRegistry {
        authorizedCloudComputingAccount: AuthorizedCloudComputingAccountModel;
    } // eslint-disable-line semi
}
