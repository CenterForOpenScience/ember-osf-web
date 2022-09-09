import Controller from '@ember/controller';
import { action } from '@ember/object';
import { alias, not } from '@ember/object/computed';
import { inject as service } from '@ember/service';

import Media from 'ember-responsive';
import IntlService from 'ember-intl/services/intl';

import BrandModel from 'ember-osf-web/models/brand';
import ProviderModel from 'ember-osf-web/models/provider';
import Registration from 'ember-osf-web/models/registration';
import { taskFor } from 'ember-concurrency-ts';

export default class RegistriesDraft extends Controller {
    @service media!: Media;
    @service intl!: IntlService;

    @not('media.isDesktop') showMobileView!: boolean;

    @alias('model.draftRegistrationManager.provider')
    provider?: ProviderModel;

    @alias('model.draftRegistrationManager.provider.brand')
    brand?: BrandModel;

    @action
    onSubmitRedirect(registrationId: Registration) {
        this.transitionToRoute('overview.index', registrationId);
    }

    @action
    saveBeforeUnload(event: BeforeUnloadEvent) {
        const { draftRegistrationManager } = this.model;
        if (draftRegistrationManager.onMetadataInput.isRunning ||
            draftRegistrationManager.onPageInput.isRunning ||
            draftRegistrationManager.lastSaveFailed) {
            event.preventDefault();
            taskFor(draftRegistrationManager.saveWithToast).perform();
            return event.returnValue = this.intl.t('registries.drafts.draft.save_before_exit');
        }
        return;
    }
}
