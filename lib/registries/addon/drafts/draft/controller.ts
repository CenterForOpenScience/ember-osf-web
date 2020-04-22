import Controller from '@ember/controller';
import { action } from '@ember/object';
import { not } from '@ember/object/computed';
import { inject as service } from '@ember/service';

import Media from 'ember-responsive';

import Brand from 'registries/services/brand';

import Registration from 'ember-osf-web/models/registration';

export default class RegistriesDraft extends Controller {
    @service media!: Media;
    @service brand!: Brand;

    @not('media.isDesktop') showMobileView!: boolean;

    @action
    onSubmitRedirect(registrationId: Registration) {
        this.transitionToRoute('overview.index', registrationId);
    }
}
