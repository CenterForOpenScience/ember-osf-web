import Route from '@ember/routing/route';

export default class DraftIndexRoute extends Route {
    beforeModel() {
        const params: { id?: string } = this.paramsFor('drafts.draft');
        return this.replaceWith('drafts.draft.metadata', params.id);
    }
}
