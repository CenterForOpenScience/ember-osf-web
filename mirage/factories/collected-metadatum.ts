import { Factory, faker } from 'ember-cli-mirage';

import CollectedMetadatum from 'ember-osf-web/models/collected-metadatum';

import { guid, guidAfterCreate } from './utils';

export default Factory.extend<CollectedMetadatum>({
    id: guid('collected-metadatum'),
    afterCreate: guidAfterCreate,
    collectedType: faker.lorem.word,
    issue: faker.lorem.word,
    programArea: faker.lorem.word,
    status: faker.lorem.word,
    volume: faker.lorem.word,
});
