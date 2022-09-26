import Route from '@ember/routing/route';

export default class GuidNodeForks extends Route {
    model() {
        return this.modelFor('guid-node');
    }
}
