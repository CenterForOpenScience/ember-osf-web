import { Factory } from 'ember-cli-mirage';
import PreprintRequestActionModel,
{ PreprintRequestActionTriggerEnum } from 'ember-osf-web/models/preprint-request-action';

import { guid, guidAfterCreate } from './utils';

export default Factory.extend<PreprintRequestActionModel>({
    id: guid('preprint'),

    actionTrigger: PreprintRequestActionTriggerEnum.SUBMIT,
    dateModified: new Date('2023-08-29T10:35:27.746938Z'),
    auto: false,

    afterCreate(preprintRequestAction, server) {
        guidAfterCreate(preprintRequestAction, server);

        preprintRequestAction.update({
            creator:  preprintRequestAction.target.creator,
            target: preprintRequestAction.target,
        });
    },
});

declare module 'ember-cli-mirage/types/registries/model' {
    export default interface MirageModelRegistry {
        'preprint-request-action': PreprintRequestActionModel;
    } // eslint-disable-line semi
}

declare module 'ember-cli-mirage/types/registries/schema' {
    export default interface MirageSchemaRegistry {
        'preprint-request-action': PreprintRequestActionModel;
    } // eslint-disable-line semi
}
