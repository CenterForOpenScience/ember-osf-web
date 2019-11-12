import Route from '@ember/routing/route';

export default class GuidNodeDrafts extends Route {
    model(params: { draftId: string }) {
        return params.draftId;
    }
}
