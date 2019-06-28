import Route from '@ember/routing/route';

export default class DraftsReviewRoute extends Route.extend({}) {
    model() {
        return this.modelFor('drafts');
    }
}
