import FactoryGuy from 'ember-data-factory-guy';
import faker from 'faker';

FactoryGuy.define('file', {
    default: {
        name: () => `${faker.lorem.words(1)}.txt`,
        kind: 'file',
        path: '/1234567890', // Faker.system.filePath may not yet be implemented
        size: () => faker.random.number(),
        provider: 'osfstorage',
        materializedPath: () => `/${faker.lorem.words(1)}.png`,
        lastTouched: null,

        dateModified: () => faker.date.recent(1),
        dateCreated: () => faker.date.past(1),

        isProvider: false,
        checkout: null,

        links: {
            upload: '/this/is/an/upload/url',
            download: '/this/is/a/download/url',
            move: '/this/is/a/move/url',
            delete: '/this/is/a/delete/url',
            new_folder: '/this/is/a/new_folder/url',
        },
    },
    traits: {
        // Folder specific
        isFolder: {
            kind: 'folder',
            materializedPath: () => `/${faker.lorem.words(1)}`,
            files: () => FactoryGuy.hasMany('file', 3),
        },
        // File specific
        hasVersions: {
            kind: 'file',
            versions: () => FactoryGuy.hasMany('file-version', 3),
        },
        hasComments: {
            kind: 'file',
            comments: () => FactoryGuy.hasMany('comment', 3),
        },
        hasTags: {
            kind: 'file',
            tags: () => [faker.lorem.words(1), faker.lorem.words(1), faker.lorem.words(1)],
        },
    },
});
