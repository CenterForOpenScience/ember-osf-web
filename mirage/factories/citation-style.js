import { Factory, faker } from 'ember-cli-mirage';

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
