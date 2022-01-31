import Route from '@ember/routing/route';

export default class RegistrationFilesRoute extends Route.extend({}) {
    model() {
        return this.modelFor('overview');
    }
}
