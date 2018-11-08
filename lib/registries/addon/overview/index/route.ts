import Route from '@ember/routing/route';

export default class ApplicationRoute extends Route.extend({}) {
    model() {
        return this.modelFor('overview');
    }
}
