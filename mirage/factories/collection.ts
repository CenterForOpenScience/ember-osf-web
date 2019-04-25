import { Factory, faker } from 'ember-cli-mirage';

import Collection from 'ember-osf-web/models/collection';

import { guid, guidAfterCreate } from './utils';

export interface MirageCollection extends Collection {
    linkedRegistrationIds: Array<string|number>;
    linkedNodeIds: Array<string|number>;
}

export default Factory.extend<MirageCollection>({
    id: guid('collection'),
    afterCreate: guidAfterCreate,

    title: faker.lorem.sentence(),
    dateCreated: faker.date.past(2, new Date(2019, 0, 0)),
    dateModified: faker.date.past(2, new Date(2019, 0, 0)),
    bookmarks: faker.random.boolean(),
});

declare module 'ember-cli-mirage/types/registries/model' {
    export default interface MirageModelRegistry {
        collections: MirageCollection;
    } // eslint-disable-line semi
}

declare module 'ember-cli-mirage/types/registries/schema' {
    export default interface MirageSchemaRegistry {
        collections: MirageCollection;
    } // eslint-disable-line semi
}
