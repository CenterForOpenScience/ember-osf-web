import { Factory } from 'ember-cli-mirage';
import faker from 'faker';

import ConfiguredCitationServiceAddonModel from 'ember-osf-web/models/configured-citation-service-addon';

export default Factory.extend<ConfiguredCitationServiceAddonModel>({
    externalUserId: faker.random.uuid(),
    externalUserDisplayName: faker.name.findName(),
});

declare module 'ember-cli-mirage/types/registries/model' {
    export default interface MirageModelRegistry {
        'configured-citation-service-addon': ConfiguredCitationServiceAddonModel;
    } // eslint-disable-line semi
}

declare module 'ember-cli-mirage/types/registries/schema' {
    export default interface MirageSchemaRegistry {
        configuredCitationServiceAddon: ConfiguredCitationServiceAddonModel;
    } // eslint-disable-line semi
}
