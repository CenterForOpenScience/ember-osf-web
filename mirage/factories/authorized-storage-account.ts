import { Factory } from 'ember-cli-mirage';
import faker from 'faker';

import AuthorizedStorageAccountModel from 'ember-osf-web/models/authorized-storage-account';

export default Factory.extend<AuthorizedStorageAccountModel>({
    externalUserId: faker.random.uuid(),
    externalUserDisplayName: faker.name.findName(),
    scopes: [],
    defaultRootFolder: faker.system.filePath(),
});

declare module 'ember-cli-mirage/types/registries/model' {
    export default interface MirageModelRegistry {
        'authorized-storage-account': AuthorizedStorageAccountModel;
    } // eslint-disable-line semi
}

declare module 'ember-cli-mirage/types/registries/schema' {
    export default interface MirageSchemaRegistry {
        authorizedStorageAccount: AuthorizedStorageAccountModel;
    } // eslint-disable-line semi
}
