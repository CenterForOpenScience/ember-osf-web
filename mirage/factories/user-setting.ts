import { association, Factory } from 'ember-cli-mirage';

import UserSetting from 'ember-osf-web/models/user-setting';

export default Factory.extend<UserSetting>({
    twoFactorEnabled: false,
    twoFactorConfirmed: false,
    subscribeOsfHelpEmail: true,
    subscribeOsfGeneralEmail: true,
    secret: '',

    user: association(),
});
