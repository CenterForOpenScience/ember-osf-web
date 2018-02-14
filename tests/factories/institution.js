import FactoryGuy from 'ember-data-factory-guy';
import faker from 'faker';

FactoryGuy.define('institution', {
    default: {
        name: () => faker.lorem.words(3),
        description: () => faker.lorem.sentences(3),
        logoPath: '/img.jpg',
        authUrl: () => faker.internet.url(),
    },
    traits: {
        // TODO: Add children relations, if that field turns out to be needed after all (henrique)
        hasNodes: {
            nodes: () => FactoryGuy.hasMany('node', 3),
        },
        hasRegistrations: {
            registrations: () => FactoryGuy.hasMany('registration', 3),
        },
    },
});
