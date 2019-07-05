import Route from '@ember/routing/route';

export default class DraftsFormRoute extends Route {
    model() {
        return this.modelFor('drafts');
    }
}
