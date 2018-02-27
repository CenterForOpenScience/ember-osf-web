import FactoryGuy from 'ember-data-factory-guy';
import faker from 'faker';

FactoryGuy.define('collection', {
    default: {
        title: () => faker.lorem.words(3),
        dateCreated: () => faker.date.past(1),
        dateModified: () => faker.date.recent(1),
        bookmarks: false,
    },
    traits: {
        hasNodes: {
            linkedNodes: FactoryGuy.hasMany('node', 3),
        },
        hasRegistrations: {
            linkedRegistrations: FactoryGuy.hasMany('registration', 3),
        },
        isBookmark: {
            bookmarks: true,
        },
    },
});
