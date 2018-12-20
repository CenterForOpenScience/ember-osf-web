import { association, Factory } from 'ember-cli-mirage';

import UserSettings from 'ember-osf-web/models/user-settings';

export default Factory.extend<UserSettings>({
    twoFactorEnabled: false,
    twoFactorConfirmed: false,
    subscribeOsfHelpEmail: true,
    subscribeOsfGeneralEmail: true,
    secret: '',

    user: association(),
});
