import { belongsTo, Factory } from 'ember-cli-mirage';
import faker from 'faker';

import ConfiguredStorageAddonModel from 'ember-osf-web/models/configured-storage-addon';

import Addons from '../fixtures/addons';

export default Factory.extend<ConfiguredStorageAddonModel>({
    storageProvider: faker.random.arrayElement(Addons).id,
    externalUserId: faker.datatype.uuid,
    externalUserDisplayName: faker.name.findName,
    rootFolder: faker.system.filePath,

    accountOwner: belongsTo('internal-user'),
    authorizedResource: belongsTo('internal-resource'),
    baseAccount: belongsTo('authorized-storage-account'),
});

// import { Factory } from 'ember-cli-mirage';
// export default Factory.extend({});

declare module 'ember-cli-mirage/types/registries/model' {
    export default interface MirageModelRegistry {
        'configured-storage-addon': ConfiguredStorageAddonModel;
        // 'configured-storage-addon': any;
    } // eslint-disable-line semi
}

declare module 'ember-cli-mirage/types/registries/schema' {
    export default interface MirageSchemaRegistry {
        configuredStorageAccount: ConfiguredStorageAddonModel;
        // configuredStorageAccount: any;
    } // eslint-disable-line semi
}
