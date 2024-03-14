import { Factory } from 'ember-cli-mirage';
import faker from 'faker';

import ConfiguredCitationAddonModel from 'ember-osf-web/models/configured-citation-addon';

export default Factory.extend<ConfiguredCitationAddonModel>({
    externalUserId: faker.random.uuid(),
    externalUserDisplayName: faker.name.findName(),
});

declare module 'ember-cli-mirage/types/registries/model' {
    export default interface MirageModelRegistry {
        'configured-citation-addon': ConfiguredCitationAddonModel;
    } // eslint-disable-line semi
}

declare module 'ember-cli-mirage/types/registries/schema' {
    export default interface MirageSchemaRegistry {
        configuredCitationAddon: ConfiguredCitationAddonModel;
    } // eslint-disable-line semi
}
