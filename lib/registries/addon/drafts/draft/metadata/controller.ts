import Controller from '@ember/controller';
import { alias, not } from '@ember/object/computed';
import RouterService from '@ember/routing/router-service';
import { inject as service } from '@ember/service';

import DraftRegistration from 'ember-osf-web/models/draft-registration';
import Media from 'ember-responsive';

import NodeModel, { NodeCategory } from 'ember-osf-web/models/node';
import DraftRegistrationManager from 'registries/drafts/draft/draft-registration-manager';
import { DraftRouteModel } from '../route';

export default class RegistriesDraftMetadata extends Controller {
    @service media!: Media;
    @service router!: RouterService;

    model!: DraftRouteModel;
    categoryOptions = Object.keys(NodeCategory);

    @alias('model.draftRegistrationManager') draftManager!: DraftRegistrationManager;
    @alias('model.draftRegistrationManager.draftRegistration') draftRegistration?: DraftRegistration;
    @alias('model.draftRegistrationManager.node') node?: NodeModel;
    @alias('model.draftRegistrationManager.initializing') loading!: boolean;

    @not('media.isDesktop') showMobileView!: boolean;
}
