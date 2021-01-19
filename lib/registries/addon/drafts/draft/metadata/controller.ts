import Controller from '@ember/controller';
import { action } from '@ember/object';
import { alias, not } from '@ember/object/computed';
import RouterService from '@ember/routing/router-service';
import { inject as service } from '@ember/service';
import Media from 'ember-responsive';

import config from 'ember-get-config';
import { NodeCategory } from 'ember-osf-web/models/node';
import DraftRegistrationManager from 'registries/drafts/draft/draft-registration-manager';

export default class RegistriesDraftMetadata extends Controller {
    @service media!: Media;
    @service router!: RouterService;

    @alias('model.draftRegistrationManager') draftManager!: DraftRegistrationManager;
    @alias('model.draftRegistrationManager.initializing') loading!: boolean;

    categoryOptions = Object.values(NodeCategory);
    showAddContributorWidget: boolean = false;

    @not('media.isDesktop') showMobileView!: boolean;
    osfUrl = config.OSF.url;

    @action
    toggleContributorWidget() {
        this.toggleProperty('showAddContributorWidget');
    }
}
