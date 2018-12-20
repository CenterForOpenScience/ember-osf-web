import { attr, belongsTo } from '@ember-decorators/data';
import DS from 'ember-data';

import defaultTo from 'ember-osf-web/utils/default-to';
import OsfModel from './osf-model';
import User from './user';

export default class UserSettingsModel extends OsfModel {
    @attr('boolean') twoFactorEnabled!: boolean;
    @attr('boolean') twoFactorConfirmed!: boolean;
    @attr('boolean') subscribeOsfHelpEmail!: boolean;
    @attr('boolean') subscribeOsfGeneralEmail!: boolean;
    @attr('string') secret: string = defaultTo(this.secret, '');

    @belongsTo('user', { inverse: 'settings' }) user!: DS.PromiseObject<User> & User;
}

declare module 'ember-data' {
    interface ModelRegistry {
        'user-settings': UserSettingsModel;
    }
}
