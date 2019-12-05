import Route from '@ember/routing/route';

export default class GuidNodeDraftsIndex extends Route {
    model() {
        this.replaceWith('registries.drafts.draft', this.modelFor('guid-node.drafts'));
    }
}
