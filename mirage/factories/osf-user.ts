import { Factory, hasMany } from 'ember-cli-mirage';

import OsfUserModel from 'ember-osf-web/models/osf-user';

export default Factory.extend<OsfUserModel>({
    authorizedStorageAccounts: hasMany('authorized-storage-account'),
    configuredResources: hasMany('osf-resource'),
});

declare module 'ember-cli-mirage/types/registries/model' {
    export default interface MirageModelRegistry {
        'osf-user': OsfUserModel;
    } // eslint-disable-line semi
}

declare module 'ember-cli-mirage/types/registries/schema' {
    export default interface MirageSchemaRegistry {
        osfUser: OsfUserModel;
    } // eslint-disable-line semi
}
