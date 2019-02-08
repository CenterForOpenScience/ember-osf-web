import { Factory, faker } from 'ember-cli-mirage';

import Collection from 'ember-osf-web/models/collection';

import { guid, guidAfterCreate } from './utils';

export default Factory.extend<Collection>({
    id: guid('collection'),
    afterCreate: guidAfterCreate,

    title: faker.lorem.sentence(),
    dateCreated: faker.date.past(2),
    dateModified: faker.date.past(2),
    bookmarks: faker.random.boolean(),
});
