import { Factory } from 'ember-cli-mirage';
import faker from 'faker';

import ExternalAccountsModel from 'ember-osf-web/models/external-accounts';

export default Factory.extend<ExternalAccountsModel>({
    profileUrl: faker.internet.url,

    displayName() {
        return faker.name.findName();
    },
});

declare module 'ember-cli-mirage/types/registries/model' {
    export default interface MirageModelRegistry {
        'external-account': ExternalAccountsModel;
    } // eslint-disable-line semi
}

declare module 'ember-cli-mirage/types/registries/schema' {
    export default interface MirageSchemaRegistry {
        externalAccounts: ExternalAccountsModel;
    } // eslint-disable-line semi
}
