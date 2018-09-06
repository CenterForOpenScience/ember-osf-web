import { Factory, faker } from 'ember-cli-mirage';

export default Factory.extend({
    id() {
        return faker.lorem.slug();
    },

    description() {
        return faker.lorem.sentence;
    },
});
