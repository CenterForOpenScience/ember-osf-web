import Route from '@ember/routing/route';

export default class RegistrationChildrenRoute extends Route.extend({}) {
    model() {
        return this.modelFor('overview');
    }
}
