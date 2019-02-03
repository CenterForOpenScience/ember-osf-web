import { association, Factory, faker } from 'ember-cli-mirage';

import Contributor from 'ember-osf-web/models/contributor';
import { Permission } from 'ember-osf-web/models/osf-model';

export default Factory.extend<Contributor>({
    permission: faker.list.cycle(...Object.values(Permission)),
    bibliographic: faker.list.cycle(true, false),
    unregisteredContributor() {
        return faker.random.number(5) ? undefined : faker.name.firstName();
    },
    index: 0,
    node: association() as Contributor['node'],
    users: association() as Contributor['users'],
});
