import Route from '@ember/routing/route';

export default class GuidNodeAddons extends Route {
    async model() {
        return await this.modelFor('guid-node').taskInstance;
    }
}
