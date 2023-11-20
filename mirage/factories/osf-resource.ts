import { Factory, hasMany } from 'ember-cli-mirage';

import OsfResourceModel from 'ember-osf-web/models/osf-resource';

export default Factory.extend<OsfResourceModel>({
    configuredStorageAddons: hasMany('configured-storage-addon'),
});

declare module 'ember-cli-mirage/types/registries/model' {
    export default interface MirageModelRegistry {
        'osf-resource': OsfResourceModel;
    } // eslint-disable-line semi
}

declare module 'ember-cli-mirage/types/registries/schema' {
    export default interface MirageSchemaRegistry {
        osfResource: OsfResourceModel;
    } // eslint-disable-line semi
}
