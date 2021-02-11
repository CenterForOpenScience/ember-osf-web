import { Factory, trait, Trait } from 'ember-cli-mirage';
import faker from 'faker';

import DraftNode from 'ember-osf-web/models/draft-node';

export interface DraftNodeTraits {
    withFiles: Trait;
}

export default Factory.extend <DraftNode & DraftNodeTraits>({
    withFiles: trait<DraftNode>({
        afterCreate(draftNode, server) {
            const count = faker.random.number({ min: 1, max: 5 });
            const osfstorage = server.create('file-provider', { draftNode });
            const files = server.createList('file', count, { target: draftNode });
            osfstorage.rootFolder.update({ files });
        },
    }),
});

declare module 'ember-cli-mirage/types/registries/model' {
    export default interface MirageModelRegistry {
        'draft-node': DraftNode;
    } // eslint-disable-line semi
}

declare module 'ember-cli-mirage/types/registries/schema' {
    export default interface MirageSchemaRegistry {
        draftNodes: DraftNode;
    } // eslint-disable-line semi
}
