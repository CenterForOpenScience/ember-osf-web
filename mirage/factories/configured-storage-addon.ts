import { Factory } from 'ember-cli-mirage';
import faker from 'faker';

import ConfiguredStorageAddonModel from 'ember-osf-web/models/configured-storage-addon';

export default Factory.extend<ConfiguredStorageAddonModel>({
    externalUserId: faker.random.uuid(),
    externalUserDisplayName: faker.name.findName(),
    rootFolder: faker.system.filePath(),
    currentUserIsOwner: true,
});

declare module 'ember-cli-mirage/types/registries/model' {
    export default interface MirageModelRegistry {
        'configured-storage-addon': ConfiguredStorageAddonModel;
    } // eslint-disable-line semi
}

declare module 'ember-cli-mirage/types/registries/schema' {
    export default interface MirageSchemaRegistry {
        configuredStorageAddon: ConfiguredStorageAddonModel;
    } // eslint-disable-line semi
}
