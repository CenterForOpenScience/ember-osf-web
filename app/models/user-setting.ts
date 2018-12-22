import { attr, belongsTo } from '@ember-decorators/data';
import { buildValidations, validator } from 'ember-cp-validations';
import DS from 'ember-data';

import OsfModel from './osf-model';
import User from './user';

const Validations = buildValidations({
    verification: [
        validator('presence', true),
        validator('number', {
            allowString: true,
            integer: true,
            positive: true,
        }),
    ],
});

export default class UserSettingModel extends OsfModel.extend(Validations) {
    @attr('boolean') twoFactorEnabled!: boolean;
    @attr('boolean') twoFactorConfirmed!: boolean;
    @attr('boolean') subscribeOsfHelpEmail!: boolean;
    @attr('boolean') subscribeOsfGeneralEmail!: boolean;
    @attr('string') secret!: string;
    @attr('number') verification?: number;

    @belongsTo('user', { inverse: 'settings', async: false }) user!: DS.PromiseObject<User> & User;
}

declare module 'ember-data' {
    interface ModelRegistry {
        'user-setting': UserSettingModel;
    }
}
