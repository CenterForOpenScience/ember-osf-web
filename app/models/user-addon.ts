import { attr, belongsTo } from '@ember-decorators/data';
import DS from 'ember-data';
import OsfModel from './osf-model';
import UserModel from './user';

export default class UserAddonModel extends OsfModel {
    @attr('boolean') userHasAuth!: boolean;

    @belongsTo('user', { inverse: 'addons' })
    user!: DS.PromiseObject<UserModel> & UserModel;
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'user-addon': UserAddonModel;
    } // eslint-disable-line semi
}
