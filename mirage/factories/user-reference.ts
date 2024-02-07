import { Factory } from 'ember-cli-mirage';

import UserReferenceModel from 'ember-osf-web/models/user-reference';

export default Factory.extend<UserReferenceModel>({
});

declare module 'ember-cli-mirage/types/registries/model' {
    export default interface MirageModelRegistry {
        'user-reference': UserReferenceModel;
    } // eslint-disable-line semi
}

declare module 'ember-cli-mirage/types/registries/schema' {
    export default interface MirageSchemaRegistry {
        userReference: UserReferenceModel;
    } // eslint-disable-line semi
}
