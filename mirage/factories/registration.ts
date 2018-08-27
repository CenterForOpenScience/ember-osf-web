// @ts-ignore
import { association, faker } from 'ember-cli-mirage';

import NodeFactory from './node';
import { guid } from './utils';

export default NodeFactory.extend({
    id(i: number) {
        return guid(i, 'registration');
    },
    registration: true,
    dateRegistered() {
        return faker.date.recent(5);
    },
    pendingRegistrationApproval() {
        return faker.random.boolean();
    },
    archiving() {
        return faker.random.boolean();
    },
    embargoed() {
        return faker.random.boolean();
    },
    embargoEndDate() {
        return faker.date.future(1);
    },
    pendingEmbargoApproval() {
        return faker.random.boolean();
    },
    withdrawn() {
        return faker.random.boolean();
    },
    withdrawalJustification: 'faulty logic',
    pendingWithdrawal() {
        return faker.random.boolean();
    },
    registeredMeta: {},
    registrationSchema: association(),
});
