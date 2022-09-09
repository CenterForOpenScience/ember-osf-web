import Controller from '@ember/controller';
import { action } from '@ember/object';
import { alias, not } from '@ember/object/computed';
import RouterService from '@ember/routing/router-service';
import { inject as service } from '@ember/service';
import { taskFor } from 'ember-concurrency-ts';
import IntlService from 'ember-intl/services/intl';
import RegistrationModel from 'ember-osf-web/models/registration';
import SchemaResponseModel from 'ember-osf-web/models/schema-response';
import Media from 'ember-responsive';

export default class EditRevisionController extends Controller {
    @service media!: Media;
    @service router!: RouterService;
    @service intl!: IntlService;
    @service toast!: Toastr;

    @not('media.isDesktop') showMobileView!: boolean;

    @alias('model.revisionManager.revision') revision?: SchemaResponseModel;
    @alias('model.revisionManager.registration') registration?: RegistrationModel;

    @action
    saveBeforeUnload(event: BeforeUnloadEvent) {
        const { revisionManager } = this.model;
        if (revisionManager.onJustificationInput.isRunning ||
            revisionManager.onPageInput.isRunning ||
            revisionManager.saveWithToast.isRunning ||
            revisionManager.lastSaveFailed) {
            event.preventDefault();
            taskFor(revisionManager.saveWithToast).perform();
            return event.returnValue = this.intl.t('registries.drafts.draft.save_before_exit');
        }
        return;
    }
}
