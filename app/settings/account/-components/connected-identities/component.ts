import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency-decorators';
import config from 'ember-get-config';
import Intl from 'ember-intl/services/intl';
import Toast from 'ember-toastr/services/toast';

import ExternalIdentity from 'ember-osf-web/models/external-identity';
import captureException from 'ember-osf-web/utils/capture-exception';

const { support: { supportEmail } } = config;

@tagName('')
export default class ConnectedIdentities extends Component {
    // Private properties
    @service intl!: Intl;
    @service toast!: Toast;
    reloadIdentitiesList!: (page?: number) => void; // bound by paginated-list

    @task
    removeIdentityTask = task(function *(this: ConnectedIdentities, identity: ExternalIdentity) {
        if (!identity) {
            return undefined;
        }

        try {
            yield identity.destroyRecord();
        } catch (e) {
            captureException(e);
            this.toast.error(this.intl.t(
                'settings.account.connected_identities.remove_fail',
                { supportEmail, htmlSafe: true },
            ));
            return false;
        }
        this.reloadIdentitiesList();
        this.toast.success(this.intl.t('settings.account.connected_identities.remove_success'));
        return true;
    });

    removeIdentity(identity: ExternalIdentity) {
        this.removeIdentityTask.perform(identity);
    }
}
