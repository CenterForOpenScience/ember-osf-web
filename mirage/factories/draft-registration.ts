// @ts-ignore
import { association, Factory, faker } from 'ember-cli-mirage';

export default Factory.extend({
    registrationSupplement: 'abcdefghijklmnopqrstuvwxyz',

    registrationMetadata: {},

    datetimeInitiated() {
        return faker.date.recent(5);
    },

    datetimeUpdated() {
        return faker.date.recent(5);
    },

    branchedFrom: association(),

    initiator: association(),

    registrationSchema: association(),
});
