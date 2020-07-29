import { Factory } from 'ember-cli-mirage';
import faker from 'faker';

export default Factory.extend({
    id() {
        return faker.lorem.word();
    },

    title() {
        return faker.lorem.sentence();
    },

    shortTitle() {
        return faker.lorem.word();
    },
});
