import Controller from '@ember/controller';
import { assert } from '@ember/debug';
import { alias, not } from '@ember/object/computed';
import RouterService from '@ember/routing/router-service';
import { inject as service } from '@ember/service';
import { waitFor } from '@ember/test-waiters';
import { task } from 'ember-concurrency';
import IntlService from 'ember-intl/services/intl';
import RegistrationModel from 'ember-osf-web/models/registration';
import SchemaResponseModel from 'ember-osf-web/models/schema-response';
import captureException, { getApiErrorMessage } from 'ember-osf-web/utils/capture-exception';
import Media from 'ember-responsive';

export default class EditRevisionController extends Controller {
    @service media!: Media;
    @service router!: RouterService;
    @service intl!: IntlService;
    @service toast!: Toastr;

    @not('media.isDesktop') showMobileView!: boolean;

    @alias('model.revisionManager.revision') revision?: SchemaResponseModel;
    @alias('model.revisionManager.registration') registration?: RegistrationModel;

    @task
    @waitFor
    async deleteRevision() {
        assert('this.revision is required to delete a revision', this.revision);
        assert('this.registration is required to redirect after deleting a revision', this.registration);
        try {
            await this.revision.destroyRecord();
            this.router.transitionTo('registries.overview.index', this.registration.id);
        } catch (e) {
            const errorMessage = this.intl.t('registries.edit_revision.delete_modal.delete_error');
            captureException(e, { errorMessage });
            this.toast.error(getApiErrorMessage(e), errorMessage);
        }
    }
}
