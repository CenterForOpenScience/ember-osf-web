import Route from '@ember/routing/route';

export default class GuidNodeComponents extends Route.extend({}) {
    model() {
        return this.modelFor('guid-node');
    }
}
