import { Factory } from 'ember-cli-mirage';
import faker from 'faker';

import PreprintModel from 'ember-osf-web/models/preprint';

import { guid, guidAfterCreate} from './utils';

export default Factory.extend<PreprintModel>({
    id: guid('preprint'),
    afterCreate(newPreprint, server) {
        guidAfterCreate(newPreprint, server);
    },

    title: faker.lorem.sentence(),
});

declare module 'ember-cli-mirage/types/registries/model' {
    export default interface MirageModelRegistry {
        preprint: PreprintModel;
    } // eslint-disable-line semi
}

declare module 'ember-cli-mirage/types/registries/schema' {
    export default interface MirageSchemaRegistry {
        preprint: PreprintModel;
    } // eslint-disable-line semi
}
