import { attr, belongsTo } from '@ember-decorators/data';
import { buildValidations, validator } from 'ember-cp-validations';
import { Link } from 'jsonapi-typescript';

import getHref from 'ember-osf-web/utils/get-href';

import OsfModel, { OsfLinks } from './osf-model';
import UserModel from './user';

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
export interface UserSettingsLinks extends OsfLinks {
    export: Link;
}

export default class UserSettingModel extends OsfModel.extend(Validations) {
    @attr() links!: UserSettingsLinks;
    @attr('boolean') twoFactorEnabled!: boolean;
    @attr('boolean') twoFactorConfirmed!: boolean;
    @attr('boolean') subscribeOsfHelpEmail!: boolean;
    @attr('boolean') subscribeOsfGeneralEmail!: boolean;
    @attr('boolean') deactivationRequested!: boolean;
    @attr('string') secret!: string;
    @attr('number') verification?: number;

    @belongsTo('user', { inverse: 'settings', async: false })
    user!: UserModel;

    async requestExport(): Promise<void> {
        await this.currentUser.authenticatedAJAX({
            url: getHref(this.links.export),
            type: 'POST',
            xhrFields: {
                withCredentials: true,
            },
            headers: {
                'Content-Type': 'application/vnd.api+json',
            },
            data: JSON.stringify({
                type: 'user-account-export-form',
                attributes: {},
            }),
        });
    }
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'user-setting': UserSettingModel;
    } // eslint-disable-line semi
}
