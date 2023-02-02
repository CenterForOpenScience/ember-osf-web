import { Factory, trait, Trait } from 'ember-cli-mirage';

import DraftNode from 'ember-osf-web/models/draft-node';
import { guid } from './utils';

export interface DraftNodeTraits {
    withFiles: Trait;
}

export default Factory.extend <DraftNode & DraftNodeTraits>({
    id: guid('draft-node'),

    withFiles: trait<DraftNode>({
        afterCreate(draftNode, server) {
            const count = 3;
            const osfstorage = server.create('file-provider', { target: draftNode });
            const files = server.createList('file', count, { target: draftNode });
            osfstorage.rootFolder.update({ files, target: draftNode });
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
