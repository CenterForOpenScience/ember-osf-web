import { AsyncBelongsTo, attr, belongsTo } from '@ember-data/model';

import AddonModel from 'ember-osf-web/models/addon';
import UserModel from 'ember-osf-web/models/user';
import OsfModel from './osf-model';

export default class ExternalAccountsModel extends OsfModel {
    @attr('fixstring') profileUrl?: string;
    @attr('fixstring') displayName!: string;

    @belongsTo('addon', { inverse: null })
    provider!: AsyncBelongsTo<AddonModel> & AddonModel;

    @belongsTo('user', { inverse: null} )
    user!: AsyncBelongsTo<UserModel> & UserModel;
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'external-account': ExternalAccountsModel;
    } // eslint-disable-line semi
}
