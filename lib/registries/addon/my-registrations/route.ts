import Route from '@ember/routing/route';

import requireAuth from 'ember-osf-web/decorators/require-auth';

@requireAuth()
export default class RegistriesMyRegistrationsRoute extends Route {
}
