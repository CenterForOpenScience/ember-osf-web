import Route from '@ember/routing/route';

export default class ResourceRoute extends Route.extend({}) {
    model() {
        return this.modelFor('overview');
    }
}
