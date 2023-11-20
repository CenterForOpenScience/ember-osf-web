import { belongsTo, Factory } from 'ember-cli-mirage';
import faker from 'faker';

import AuthorizedStorageAccountModel from 'ember-osf-web/models/authorized-storage-account';

import Addons from '../fixtures/addons';

export default Factory.extend<AuthorizedStorageAccountModel>({
    storageProvider: faker.random.arrayElement(Addons).id,
    externalUserId: faker.datatype.uuid,
    externalUserDisplayName: faker.name.findName,
    scopes: [],
    defaultRootFolder: faker.system.filePath,

    configuringUser: belongsTo('internal-user'),
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
