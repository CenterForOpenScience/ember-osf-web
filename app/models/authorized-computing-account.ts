import { AsyncBelongsTo, belongsTo } from '@ember-data/model';

import ExternalComputingService from './external-computing-service';
import AuthorizedAccountModel from './authorized-account';

export default class AuthorizedComputingAccount extends AuthorizedAccountModel {
    @belongsTo('external-computing-service')
    computingService!: AsyncBelongsTo<ExternalComputingService> & ExternalComputingService;
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'authorized-computing-account': AuthorizedComputingAccount;
    } // eslint-disable-line semi
}
