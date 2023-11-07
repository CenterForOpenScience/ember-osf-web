import { AsyncHasMany, attr, hasMany } from '@ember-data/model';

import ExternalAccountsModel from 'ember-osf-web/models/external-accounts';

import OsfModel from './osf-model';


export default class UserAddonModel extends OsfModel {
    @attr('boolean') userHasAuth!: boolean;

    @hasMany('external-accounts', { inverse: null })
    externalAccounts!: AsyncHasMany<ExternalAccountsModel> & ExternalAccountsModel[];
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'user-addon': UserAddonModel;
    } // eslint-disable-line semi
}
