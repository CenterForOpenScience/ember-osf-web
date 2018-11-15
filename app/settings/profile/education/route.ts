import requireAuth from 'ember-osf-web/decorators/require-auth';

import SettingsProfileRoute from '../base-route';

@requireAuth()
export default class SettingsProfileEducationRoute extends SettingsProfileRoute { }
