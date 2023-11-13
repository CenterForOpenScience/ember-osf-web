import { Factory } from 'ember-cli-mirage';

import UserAddonModel from 'ember-osf-web/models/user-addon';

export default Factory.extend<UserAddonModel>({
    userHasAuth: true,
});

declare module 'ember-cli-mirage/types/registries/model' {
    export default interface MirageModelRegistry {
        'user-addon': UserAddonModel;
    } // eslint-disable-line semi
}

declare module 'ember-cli-mirage/types/registries/schema' {
    export default interface MirageSchemaRegistry {
        userAddons: UserAddonModel;
    } // eslint-disable-line semi
}
