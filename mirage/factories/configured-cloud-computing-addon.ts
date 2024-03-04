import { Factory } from 'ember-cli-mirage';
import faker from 'faker';

import ConfiguredCloudComputingAddonModel from 'ember-osf-web/models/configured-cloud-computing-addon';

export default Factory.extend<ConfiguredCloudComputingAddonModel>({
    externalUserId: faker.random.uuid(),
    externalUserDisplayName: faker.name.findName(),
});

declare module 'ember-cli-mirage/types/registries/model' {
    export default interface MirageModelRegistry {
        'configured-cloud-computing-addon': ConfiguredCloudComputingAddonModel;
    } // eslint-disable-line semi
}

declare module 'ember-cli-mirage/types/registries/schema' {
    export default interface MirageSchemaRegistry {
        configuredCloudComputingAddon: ConfiguredCloudComputingAddonModel;
    } // eslint-disable-line semi
}
