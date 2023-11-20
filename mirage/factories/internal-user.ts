import { Factory, hasMany } from 'ember-cli-mirage';

import InternalUserModel from 'ember-osf-web/models/internal-user';

export default Factory.extend<InternalUserModel>({
    authorizedStorageAccounts: hasMany('authorized-storage-account'),
    configuredResources: hasMany('internal-resource'),
});

declare module 'ember-cli-mirage/types/registries/model' {
    export default interface MirageModelRegistry {
        'internal-user': InternalUserModel;
    } // eslint-disable-line semi
}

declare module 'ember-cli-mirage/types/registries/schema' {
    export default interface MirageSchemaRegistry {
        internalUser: InternalUserModel;
    } // eslint-disable-line semi
}
