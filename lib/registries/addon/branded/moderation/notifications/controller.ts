import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import config from 'ember-get-config';
import CurrentUserService from 'ember-osf-web/services/current-user';
import pathJoin from 'ember-osf-web/utils/path-join';

export default class BrandedModerationNotificationsController extends Controller {
    @service currentUser!: CurrentUserService;
    userSettingsLink: string = pathJoin(config.OSF.url, 'settings', 'notifications');
}
