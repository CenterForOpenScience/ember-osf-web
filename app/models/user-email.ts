import { attr, belongsTo } from '@ember-decorators/data';
import DS from 'ember-data';

import OsfModel from './osf-model';
import UserModel from './user';

export default class UserEmailModel extends OsfModel {
    @attr() emailAddress!: string;
    @attr('boolean') confirmed!: boolean;
    @attr('boolean') verified!: boolean;
    @attr('boolean') primary!: boolean;
    @attr('boolean') isMerge!: boolean;

    @belongsTo('user', { inverse: 'emails' })
    user!: DS.PromiseObject<UserModel> & UserModel;
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'user-email': UserEmailModel;
    } // eslint-disable-line semi
}
