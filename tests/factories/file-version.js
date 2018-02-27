import FactoryGuy from 'ember-data-factory-guy';
import faker from 'faker';

FactoryGuy.define('file-version', {
    default: {
        size: () => faker.random.number(),
        contentType: 'text/plain', // faker.system may not come with older versions of lib
    },
});
