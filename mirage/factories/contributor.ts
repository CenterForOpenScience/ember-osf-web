import { association, Factory, faker } from 'ember-cli-mirage';

import Contributor from 'ember-osf-web/models/contributor';

export default Factory.extend<Contributor>({
    permission: faker.list.cycle('admin', 'write', 'read'),
    bibliographic: faker.list.cycle(true, false),
    unregisteredContributor: undefined,
    index: 0,
    node: association() as Contributor['node'],
    users: association() as Contributor['users'],
});
