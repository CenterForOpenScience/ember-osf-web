import Route from '@ember/routing/route';

import { RevisionRoute } from 'registries/edit-revision/nav-manager';

import { EditRevisionRouteModel } from '../route';

export default class EditRevisionJustification extends Route {
    model(): EditRevisionRouteModel {
        const editRevisionRouteModel = this.modelFor('edit-revision') as EditRevisionRouteModel;
        const { navigationManager } = editRevisionRouteModel;

        navigationManager.setPageAndRoute(RevisionRoute.Justification);

        return this.modelFor('edit-revision') as EditRevisionRouteModel;
    }
}
