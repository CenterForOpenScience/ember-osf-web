import { Factory } from 'ember-cli-mirage';

import RevisionModel from 'ember-osf-web/models/revision';

export default Factory.extend<RevisionModel>({

});

declare module 'ember-cli-mirage/types/registries/model' {
    export default interface MirageModelRegistry {
        revision: RevisionModel;
    } // eslint-disable-line semi
}

declare module 'ember-cli-mirage/types/registries/schema' {
    export default interface MirageSchemaRegistry {
        revisions: RevisionModel;
    } // eslint-disable-line semi
}
