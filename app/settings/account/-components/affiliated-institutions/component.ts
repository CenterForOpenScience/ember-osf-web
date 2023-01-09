import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import CurrentUserService from 'ember-osf-web/services/current-user';
import { task } from 'ember-concurrency';
import { waitFor } from '@ember/test-waiters';
import { taskFor } from 'ember-concurrency-ts';
import InstitutionModel from 'ember-osf-web/models/institution';
import config from 'ember-get-config';
import IntlService from 'ember-intl/services/intl';
import captureException, { getApiErrorMessage } from 'ember-osf-web/utils/capture-exception';

const { support: { supportEmail } } = config;

export default class AffiliatedInstitutionsComponent extends Component {
    @service currentUser!: CurrentUserService;
    @service intl!: IntlService;
    @service toast!: Toastr;

    reloadAffiliations: any;

    @task
    @waitFor
    async removeAffiliationTask(institution: InstitutionModel) {
        try {
            await this.currentUser.user?.deleteM2MRelationship('institutions', institution);
        } catch (e) {
            const errorMessage = this.intl.t(
                'settings.account.connected_identities.remove_fail',
                { supportEmail, htmlSafe: true },
            );
            captureException(e, { errorMessage: errorMessage.toString() });
            this.toast.error(getApiErrorMessage(e), errorMessage as string);
        }
        this.reloadAffiliations();
    }

    removeAffiliation(institution: InstitutionModel) {
        taskFor(this.removeAffiliationTask).perform(institution);
    }
}
