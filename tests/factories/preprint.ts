import FactoryGuy from 'ember-data-factory-guy';
import faker from 'faker';

FactoryGuy.define('preprint', {
    default: {
        dateCreated: () => faker.date.past(2),
        datePublished: () => faker.date.past(1),
        dateModified: () => faker.date.recent(),
        doi: () => `10.1000/${String(faker.random.number())}`,
        node: FactoryGuy.belongsTo('node'),
        license: FactoryGuy.belongsTo('license'),
        primaryFile: FactoryGuy.belongsTo('file'),
        provider: FactoryGuy.belongsTo('preprint-provider'),
        isPublished: false,
        isPreprintOrphan: false,
    },
    traits: {
        hasBeenPublished: {
            isPublished: true,
        },
    },
});
