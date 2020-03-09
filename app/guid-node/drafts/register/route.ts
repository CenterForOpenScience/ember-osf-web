import Route from '@ember/routing/route';

export default class GuidNodeDraftsRegister extends Route {
    model() {
        this.replaceWith('registries.drafts.draft.review', this.modelFor('guid-node.drafts'));
    }
}
