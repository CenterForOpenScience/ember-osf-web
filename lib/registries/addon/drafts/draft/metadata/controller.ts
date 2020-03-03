import Controller from '@ember/controller';
import { alias, not } from '@ember/object/computed';
import RouterService from '@ember/routing/router-service';
import { inject as service } from '@ember/service';
import Media from 'ember-responsive';

import { NodeCategory } from 'ember-osf-web/models/node';
import DraftRegistrationManager from 'registries/drafts/draft/draft-registration-manager';

export default class RegistriesDraftMetadata extends Controller {
    @service media!: Media;
    @service router!: RouterService;

    @alias('model.draftRegistrationManager') draftManager!: DraftRegistrationManager;
    @alias('model.draftRegistrationManager.initializing') loading!: boolean;

    categoryOptions = Object.values(NodeCategory);

    @not('media.isDesktop') showMobileView!: boolean;
}
