import { AsyncHasMany, attr, hasMany } from '@ember-data/model';

import OsfModel from './osf-model';
import OsfUserModel from './osf-user';

export default class AddonExternalAccountModel extends OsfModel {
    @attr('fixstring') provider!: string;
    @attr('fixstring') profileId!: string;

    @hasMany('osf-user', { inverse: 'externalAccounts' })
    users!: AsyncHasMany<OsfUserModel> & OsfUserModel[];
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'addon-external-account': AddonExternalAccountModel;
    } // eslint-disable-line semi
}
