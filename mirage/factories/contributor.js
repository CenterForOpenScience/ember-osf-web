import { association, Factory, faker } from 'ember-cli-mirage';

export default Factory.extend({
    permission: faker.list.cycle('admin', 'write', 'read'),
    bibliographic: faker.list.cycle(true, false),
    unregisteredContributor: null,
    index: 0,
    node: association(),
    users: association(),
});
