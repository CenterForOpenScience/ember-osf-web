import { association, Factory } from 'ember-cli-mirage';

import UserSetting from 'ember-osf-web/models/user-setting';

export interface MirageUserSetting extends UserSetting {
    userId: string | number;
}

export default Factory.extend<MirageUserSetting>({
    id(index) {
        if (this.user && 'id' in this.user) {
            return this.user.id;
        } else if (this.userId) {
            return this.userId as string;
        }
        return index.toString();
    },
    twoFactorEnabled: false,
    twoFactorConfirmed: false,
    subscribeOsfHelpEmail: true,
    subscribeOsfGeneralEmail: true,
    deactivationRequested: false,
    secret: '',

    user: association(),
});

declare module 'ember-cli-mirage/types/registries/model' {
    export default interface MirageModelRegistry {
        'user-setting': MirageUserSetting;
    } // eslint-disable-line semi
}

declare module 'ember-cli-mirage/types/registries/schema' {
    export default interface MirageSchemaRegistry {
        userSettings: MirageUserSetting;
    } // eslint-disable-line semi
}
