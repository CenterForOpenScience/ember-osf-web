import { Factory } from 'ember-cli-mirage';
import faker from 'faker';

import ConfiguredComputingAddonModel from 'ember-osf-web/models/configured-computing-addon';

export default Factory.extend<ConfiguredComputingAddonModel>({
    externalUserId: faker.random.uuid(),
    externalUserDisplayName: faker.name.findName(),
});

declare module 'ember-cli-mirage/types/registries/model' {
    export default interface MirageModelRegistry {
        'configured-computing-addon': ConfiguredComputingAddonModel;
    } // eslint-disable-line semi
}

declare module 'ember-cli-mirage/types/registries/schema' {
    export default interface MirageSchemaRegistry {
        configuredComputingAddon: ConfiguredComputingAddonModel;
    } // eslint-disable-line semi
}
