import { association, Factory } from 'ember-cli-mirage';
import UserAddon from 'ember-osf-web/models/user-addon';

export default Factory.extend<UserAddon>({
    userHasAuth: true,

    user: association(),
});
