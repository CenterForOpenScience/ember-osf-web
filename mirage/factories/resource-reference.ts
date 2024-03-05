import { Factory } from 'ember-cli-mirage';

import config from 'ember-osf-web/config/environment';
import ResourceReferenceModel from 'ember-osf-web/models/resource-reference';

const { OSF: { url } } = config;

export default Factory.extend<ResourceReferenceModel>({
    resourceUri: '',
    afterCreate(resourceReference){
        const guid = resourceReference.id;
        resourceReference.resourceUri = `${url}${guid}`;
        resourceReference.save();
    },
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
