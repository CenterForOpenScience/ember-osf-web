import { Factory } from 'ember-cli-mirage';

import Taxonomy from 'ember-osf-web/models/taxonomy';

import { guid, guidAfterCreate } from './utils';

export default Factory.extend<Taxonomy>({
    id: guid('taxonomy'),
    afterCreate: guidAfterCreate,
});

declare module 'ember-cli-mirage/types/registries/model' {
    export default interface MirageModelRegistry {
        'taxonomy': Taxonomy;
    } // eslint-disable-line semi
}

declare module 'ember-cli-mirage/types/registries/schema' {
    export default interface MirageSchemaRegistry {
        taxonomies: Taxonomy;
    } // eslint-disable-line semi
}
