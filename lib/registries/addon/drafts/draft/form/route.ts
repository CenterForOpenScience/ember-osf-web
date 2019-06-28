import Route from '@ember/routing/route';

export default class DraftsFormRoute extends Route.extend({}) {
    model() {
        return this.modelFor('drafts');
    }
}
