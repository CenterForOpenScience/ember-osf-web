import { Factory, Trait, trait } from 'ember-cli-mirage';
import faker from 'faker';
import PreprintRequestModel,
{ PreprintRequestMachineState, PreprintRequestType } from 'ember-osf-web/models/preprint-request';
import { PreprintRequestActionTriggerEnum } from 'ember-osf-web/models/preprint-request-action';

import { guid, guidAfterCreate} from './utils';

export interface PreprintRequestTraits {
    pending: Trait;
    rejectComment: Trait;
    acceptComment: Trait;
    rejectNoComment: Trait;
}

export default Factory.extend<PreprintRequestModel & PreprintRequestTraits>({
    id: guid('preprint'),

    comment: faker.lorem.sentence(100),
    machineState: PreprintRequestMachineState.PENDING,
    requestType: PreprintRequestType.WITHDRAWAL,
    dateLastTransitioned: new Date('2023-08-29T10:35:27.746938Z'),
    created: new Date('2023-08-29T10:35:27.746938Z'),
    modified: new Date('2023-08-29T10:35:27.746938Z'),

    afterCreate(preprintRequest, server) {
        guidAfterCreate(preprintRequest, server);

        const creator = server.create('user', {
            givenName: 'Trio',
            familyName: 'Lipa',
        });

        preprintRequest.update({
            creator,
            target: preprintRequest.target,
        });
    },

    pending: trait<PreprintRequestModel>({
        afterCreate(preprintRequest, server) {
            const preprintRequestAction = server.create('preprintRequestAction',
                {
                    actionTrigger: PreprintRequestActionTriggerEnum.SUBMIT,
                    target: preprintRequest,
                });
            preprintRequest.update({ actions: [preprintRequestAction ]});
        },
    }),

    rejectNoComment: trait<PreprintRequestModel>({
        afterCreate(preprintRequest, server) {
            const preprintRequestAction = server.create('preprintRequestAction',
                {
                    actionTrigger: PreprintRequestActionTriggerEnum.REJECT,
                    target: preprintRequest,
                    comment: null,
                });
            preprintRequest.update({ actions: [preprintRequestAction ]});
        },
    }),

    rejectComment: trait<PreprintRequestModel>({
        afterCreate(preprintRequest, server) {
            const preprintRequestAction = server.create('preprintRequestAction',
                {
                    actionTrigger: PreprintRequestActionTriggerEnum.REJECT,
                    target: preprintRequest,
                    comment: faker.lorem.sentence(100),
                });
            preprintRequest.update({ actions: [preprintRequestAction ]});
        },
    }),

    acceptComment: trait<PreprintRequestModel>({
        afterCreate(preprintRequest, server) {
            const preprintRequestAction = server.create('preprintRequestAction',
                {
                    actionTrigger: PreprintRequestActionTriggerEnum.ACCEPT,
                    target: preprintRequest,
                    comment: faker.lorem.sentence(100),
                });
            preprintRequest.update({ actions: [preprintRequestAction ]});
        },
    }),
});

declare module 'ember-cli-mirage/types/registries/model' {
    export default interface MirageModelRegistry {
        'preprint-request': PreprintRequestModel;
    } // eslint-disable-line semi
}

declare module 'ember-cli-mirage/types/registries/schema' {
    export default interface MirageSchemaRegistry {
        'preprint-request': PreprintRequestModel;
    } // eslint-disable-line semi
}
