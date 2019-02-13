import { association, Factory, faker } from 'ember-cli-mirage';
import AccountModel from 'ember-osf-web/models/account';

export default Factory.extend<AccountModel>({
    displayName: faker.name.findName(),
    profileUrl: faker.internet.url(),
    provider: faker.lorem.word(),

    addon: association(),
});
