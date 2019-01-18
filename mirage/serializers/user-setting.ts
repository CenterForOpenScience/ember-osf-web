import { ModelInstance } from 'ember-cli-mirage';
import config from 'ember-get-config';
import UserSetting from 'ember-osf-web/models/user-setting';
import ApplicationSerializer from './application';

const { OSF: { apiUrl } } = config;

export default class UserSettingSerializer extends ApplicationSerializer<UserSetting> {
    buildNormalLinks(model: ModelInstance<UserSetting>) {
        return {
            self: `${apiUrl}/v2/users/${model.user.id}/settings/`,
            html: '/settings/',
            export: `${apiUrl}/v2/users/${model.user.id}/settings/export/`,
        };
    }
}
