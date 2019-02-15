import { association, Factory, faker } from 'ember-cli-mirage';
import AccountModel from 'ember-osf-web/models/account';

export default Factory.extend<AccountModel>({
    displayName() {
        return faker.internet.userName();
    },
    profileUrl() {
        return faker.internet.url();
    },
    provider() {
        return faker.lorem.word();
    },

    addon: association(),
});
