import Route from '@ember/routing/route';

export default class RegistrationCommentsRoute extends Route.extend({}) {
    model() {
        return this.modelFor('overview');
    }
}
