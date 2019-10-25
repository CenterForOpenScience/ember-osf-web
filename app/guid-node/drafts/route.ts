import Route from '@ember/routing/route';

export default class GuidNodeDrafts extends Route {
    model(params: { draft_id: string }) { // eslint-disable-line camelcase
        this.transitionTo('registries.drafts.draft-shim', params.draft_id);
    }
}
