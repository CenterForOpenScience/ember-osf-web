import { AsyncBelongsTo, attr, belongsTo, hasMany } from '@ember-data/model';
import PreprintModel from 'ember-osf-web/models/preprint';
import UserModel from 'ember-osf-web/models/user';
import PreprintRequestActionModel from 'ember-osf-web/models/preprint-request-action';

import OsfModel from './osf-model';

export default class PreprintRequestModel extends OsfModel {
    @attr('string') comment!: String;
    @attr('date') dateLastTransitioned!: Date;
    @attr('date') created!: Date;
    @attr('date') modified!: Date;
    @attr('string') machineState!: String;
    @attr('string') requestType!: String;

    @belongsTo('preprint', { polymorphic: false, inverse: 'requests', async: true})
    target!: (AsyncBelongsTo<PreprintModel> & PreprintModel);

    @belongsTo('user', { inverse: null, async: true })
    creator!: AsyncBelongsTo<UserModel> & UserModel;

    @hasMany('preprint-request-action', { inverse: 'target', async: true })
    actions!: AsyncBelongsTo<PreprintRequestActionModel> & PreprintRequestActionModel;
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        preprintRequest: PreprintRequestModel;
    } // eslint-disable-line semi
}
