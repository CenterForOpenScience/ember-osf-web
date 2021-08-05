import { Factory } from 'ember-cli-mirage';

import RevisionModel from 'ember-osf-web/models/revision';

export interface MirageRevisionModel extends RevisionModel {
    registrationId: string;
}

export default Factory.extend<MirageRevisionModel>({
    afterCreate(revision) {
        if (revision.registration) {
            revision.registrationSchema = revision.registration.registrationSchema;
            revision.save();
        }
    },
});

declare module 'ember-cli-mirage/types/registries/model' {
    export default interface MirageModelRegistry {
        revision: MirageRevisionModel;
    } // eslint-disable-line semi
}

declare module 'ember-cli-mirage/types/registries/schema' {
    export default interface MirageSchemaRegistry {
        revisions: MirageRevisionModel;
    } // eslint-disable-line semi
}
