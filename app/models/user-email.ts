import { attr, belongsTo } from '@ember-decorators/data';
import DS from 'ember-data';

import OsfModel from './osf-model';
import User from './user';

export default class UserEmailModel extends OsfModel {
    @attr() emailAddress!: string;
    @attr('boolean') confirmed!: boolean;
    @attr('boolean') verified!: boolean;
    @attr('boolean') primary!: boolean;
    @attr('boolean') userMerge!: boolean;

    @belongsTo('user', { inverse: 'emails' }) user!: DS.PromiseObject<User> & User;
}

declare module 'ember-data' {
    interface ModelRegistry {
        'user-email': UserEmailModel;
    }
}
