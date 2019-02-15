import { association, Factory, faker } from 'ember-cli-mirage';

import Contributor from 'ember-osf-web/models/contributor';
import { Permission } from 'ember-osf-web/models/osf-model';

export default Factory.extend<Contributor>({
    permission: faker.list.cycle(...Object.values(Permission)),
    bibliographic: faker.list.cycle(true, false),
    unregisteredContributor() {
        return faker.random.number(5) ? undefined : faker.name.firstName();
    },
    index(i: number) {
        return i;
    },
    node: association() as Contributor['node'],
    users: association() as Contributor['users'],
});

declare module 'ember-cli-mirage/types/registries/schema' {
    export default interface MirageSchemaRegistry {
        contributors: Contributor;
    } // eslint-disable-line semi
}
