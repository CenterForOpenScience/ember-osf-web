import Controller from '@ember/controller';
import { alias } from '@ember/object/computed';
import RouterService from '@ember/routing/router-service';
import { inject as service } from '@ember/service';

import Media from 'ember-responsive';

import NodeModel from 'ember-osf-web/models/node';
import DraftRegistrationManager from 'registries/drafts/draft/draft-registration-manager';
import NavigationManager from 'registries/drafts/draft/navigation-manager';
import { DraftPageRouteModel } from './route';

export default class RegistriesDraftPage extends Controller {
    @service media!: Media;
    @service router!: RouterService;

    model!: DraftPageRouteModel;

    @alias('model.draftRegistrationManager') draftRegistrationManager!: DraftRegistrationManager;
    @alias('model.navigationManager') navigationManager!: NavigationManager;
    @alias('model.taskInstance.value.node') node?: NodeModel;
    @alias('model.pageIndex') pageIndex!: number;
}
