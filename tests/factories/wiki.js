import FactoryGuy from 'ember-data-factory-guy';
import faker from 'faker';

FactoryGuy.define('wiki', {
    defaults: {
        kind: 'file',
        name: () => faker.lorem.words(2),
        dateModified: () => faker.date.recent(),
        contentType: 'text/markdown',
        path: () => `/${faker.lorem.words(1)}`,
        currentUserCanComment: () => faker.random.boolean(),
        materializedPath: () => `/${faker.lorem.words(1)}`,
        size: () => faker.random.number(),
        node: FactoryGuy.belongsTo('node'),
    },
});
