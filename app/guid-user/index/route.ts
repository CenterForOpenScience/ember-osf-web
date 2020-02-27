import Route from '@ember/routing/route';

export default class GuidUserIndex extends Route.extend({
}) {
    model() {
        return this.modelFor('guid-user');
    }
}
