import FactoryGuy from 'ember-data-factory-guy';
import faker from 'faker';

FactoryGuy.define('comment', {
    default: {
        content: () => faker.lorem.sentence(),

        dateCreated: () => faker.date.past(1),
        dateModified: () => faker.date.recent(1),

        modified: true,
        deleted: false,

        isAbuse: false,
        hasChildren: false,

        canEdit: true,
    },
    traits: {
        // List of possible "page" values h/t Saman- must be one of these values. Mutually exclusive.
        isWiki: {
            page: 'wiki',
        },
        isNode: {
            page: 'node',
        },
        isFile: {
            page: 'files',
        },
        // TODO: Add a hasReplies trait in the future to support replies-
        // can we make reply page type match the specified parent type?
        // Not sure if reply needs to have same page type for hasReplies to be useful.
        // Can always make manual replies with relevant type
        hasReplies: {
            replies: FactoryGuy.hasMany('comment', 3),
        },
    },
});
