import { Factory, hasMany } from 'ember-cli-mirage';

import InternalResourceModel from 'ember-osf-web/models/internal-resource';

export default Factory.extend<InternalResourceModel>({
    configuredStorageAddons: hasMany('configured-storage-addon'),
});

declare module 'ember-cli-mirage/types/registries/model' {
    export default interface MirageModelRegistry {
        'internal-resource': InternalResourceModel;
    } // eslint-disable-line semi
}

declare module 'ember-cli-mirage/types/registries/schema' {
    export default interface MirageSchemaRegistry {
        internalResource: InternalResourceModel;
    } // eslint-disable-line semi
}
