import Route from '@ember/routing/route';

export default class OverviewRoute extends Route.extend({}) {
    model() {
        return this.modelFor('overview');
    }
}
