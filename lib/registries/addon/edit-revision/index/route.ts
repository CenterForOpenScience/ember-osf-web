import Route from '@ember/routing/route';

export default class EditRevisionIndexRoute extends Route {
    beforeModel() {
        const params: { revisionId?: string } = this.paramsFor('edit-revision');
        return this.replaceWith('edit-revision.justification', params.revisionId);
    }
}
