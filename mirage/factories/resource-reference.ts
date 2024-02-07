import { Factory } from 'ember-cli-mirage';

import ResourceReferenceModel from 'ember-osf-web/models/resource-reference';

export default Factory.extend<ResourceReferenceModel>({
});

declare module 'ember-cli-mirage/types/registries/model' {
    export default interface MirageModelRegistry {
        'resource-reference': ResourceReferenceModel;
    } // eslint-disable-line semi
}

declare module 'ember-cli-mirage/types/registries/schema' {
    export default interface MirageSchemaRegistry {
        resourceReference: ResourceReferenceModel;
    } // eslint-disable-line semi
}
