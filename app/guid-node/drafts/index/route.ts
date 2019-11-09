import Route from '@ember/routing/route';

export default class GuidNodeDraftsIndex extends Route {
    model() {
        this.replaceWith('registries.drafts.draft-shim', this.modelFor('guid-node.drafts'));
    }
}
