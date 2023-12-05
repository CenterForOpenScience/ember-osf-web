import { Factory } from 'ember-cli-mirage';

import InternalUserModel from 'ember-osf-web/models/internal-user';

export default Factory.extend<InternalUserModel>({
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
