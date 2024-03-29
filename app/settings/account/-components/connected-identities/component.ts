import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { waitFor } from '@ember/test-waiters';
import { task } from 'ember-concurrency';
import { taskFor } from 'ember-concurrency-ts';
import config from 'ember-osf-web/config/environment';
import Intl from 'ember-intl/services/intl';
import Toast from 'ember-toastr/services/toast';

import ExternalIdentity from 'ember-osf-web/models/external-identity';
import captureException, { getApiErrorMessage } from 'ember-osf-web/utils/capture-exception';

const { support: { supportEmail } } = config;

@tagName('')
export default class ConnectedIdentities extends Component {
    // Private properties
    @service intl!: Intl;
    @service toast!: Toast;
    reloadIdentitiesList!: (page?: number) => void; // bound by paginated-list

    @task
    @waitFor
    async removeIdentityTask(identity: ExternalIdentity) {
        if (!identity) {
            return undefined;
        }

        try {
            await identity.destroyRecord();
        } catch (e) {
            const errorMessage = this.intl.t(
                'settings.account.connected_identities.remove_fail',
                { supportEmail, htmlSafe: true },
            );
            captureException(e, { errorMessage: errorMessage.toString() });
            this.toast.error(getApiErrorMessage(e), errorMessage as string);
            return false;
        }
        this.reloadIdentitiesList();
        this.toast.success(this.intl.t('settings.account.connected_identities.remove_success'));
        return true;
    }

    removeIdentity(identity: ExternalIdentity) {
        taskFor(this.removeIdentityTask).perform(identity);
    }
}
