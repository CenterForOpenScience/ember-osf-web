import Controller from '@ember/controller';
import { alias } from '@ember/object/computed';
import config from 'ember-get-config';
import pathJoin from 'ember-osf-web/utils/path-join';

export default class ModerationSettingsController extends Controller {
    userSettingsLink = pathJoin(config.OSF.url, 'settings', 'notifications');
    @alias('model.id') providerId?: string;
}
