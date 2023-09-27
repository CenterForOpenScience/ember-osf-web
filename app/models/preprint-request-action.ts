import { AsyncBelongsTo, attr, belongsTo } from '@ember-data/model';
import PreprintRequestModel from 'ember-osf-web/models/preprint-request';
import UserModel from 'ember-osf-web/models/user';

import OsfModel from './osf-model';

export default class PreprintRequestActionModel extends OsfModel {
    @attr('string') comment!: String;
    @attr('string') actionTrigger!: String;
    @attr('date') dateModified!: Date;
    @attr('boolean') auto!: boolean;

    // Relationships
    @belongsTo('preprint-request', { polymorphic: false, inverse: 'actions', async: true})
    target!: (AsyncBelongsTo<PreprintRequestModel> & PreprintRequestModel);

    @belongsTo('user', { inverse: null, async: true })
    creator!: AsyncBelongsTo<UserModel> & UserModel;
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        preprintRequestAction: PreprintRequestActionModel;
    } // eslint-disable-line semi
}
